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

      if (
        !isLoginRequest &&
        !isInitialMeUnauthorized &&
        !isShowingError &&
        [401, 403, 404, 500].includes(status)
      ) {
        isShowingError = true;

        if (status === 401) {
          await SecureStore.deleteItemAsync('authToken');
        }

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