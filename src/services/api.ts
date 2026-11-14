import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

let isShowingError = false;

export function resetErrorNavigationLock() {
  isShowingError = false;
}

// ---------------------------------------------------------------------------
// Sessão expirada (401) e logout
//
// Antes, qualquer 401 mandava o usuário para a tela de erro "/error".
// Agora o 401 de uma sessão expirada chama um "handler" registrado pelo
// AuthContext, que limpa o usuário e deixa as rotas protegidas redirecionarem
// para o login (onde mostramos um aviso). Assim não existe tela de erro
// para expiração nem para logout.
// ---------------------------------------------------------------------------
type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | undefined;
let isHandlingUnauthorized = false;
let ignoreUnauthorized = false;

// O AuthContext registra aqui o que fazer quando a sessão expira
export function setUnauthorizedHandler(handler: UnauthorizedHandler | undefined) {
  unauthorizedHandler = handler;
}

// Chamado no logout: respostas 401 de requisições que ainda estavam
// em andamento (ou de telas que ainda não desmontaram) são ignoradas
export function ignoreUnauthorizedResponses() {
  ignoreUnauthorized = true;
}

// Chamado no login: volta a tratar 401 normalmente
export function resumeUnauthorizedHandling() {
  ignoreUnauthorized = false;
  isHandlingUnauthorized = false;
}

function isCleanBackendString(text: unknown): text is string {
  if (typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 180) return false;

  const lower = trimmed.toLowerCase();
  return (
    !lower.includes('<!doctype') &&
    !lower.includes('<html') &&
    !lower.startsWith('cannot ')
  );
}

function extractBackendMessage(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined;

  const data = error.response?.data as
    | { message?: unknown; error?: unknown }
    | string
    | undefined;

  if (isCleanBackendString(data)) return data.trim();
  if (typeof data === 'object' && data !== null) {
    if (isCleanBackendString(data.message)) return data.message.trim();
    if (isCleanBackendString(data.error)) return data.error.trim();
  }

  return undefined;
}

api.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync('authToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, config } = error.response;
      const requestUrl = config?.url ?? '';

      const isLoginRequest = requestUrl.includes('/auth/login');
      const isInitialMeUnauthorized = requestUrl.includes('/user/me') && status === 401;

      // 401 fora do login = sessão expirada (ou token inválido).
      // Só conta se a requisição foi enviada com token; sem token
      // não havia sessão para expirar.
      if (status === 401 && !isLoginRequest && !isInitialMeUnauthorized) {
        const hadToken = Boolean(error.config?.headers?.Authorization);

        if (hadToken && !ignoreUnauthorized && !isHandlingUnauthorized) {
          isHandlingUnauthorized = true;
          await SecureStore.deleteItemAsync('authToken');
          unauthorizedHandler?.();
        }

        return Promise.reject(error);
      }

      if (
        !isLoginRequest &&
        !isInitialMeUnauthorized &&
        !isShowingError &&
        [403, 404, 500].includes(status)
      ) {
        isShowingError = true;

        const message = extractBackendMessage(error);

        router.replace({
          pathname: '/error',
          params: {
            code: String(status),
            ...(message ? { message } : {}),
          },
        });
      }
    }

    return Promise.reject(error);
  }
);