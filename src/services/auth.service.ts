import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { api } from './api';

function isCleanMessage(text: unknown): text is string {
  if (typeof text !== 'string') return false;
  const trimmed = text.trim();

  if (!trimmed || trimmed.length > 180) return false;

  const technicalPatterns = [
    '<!doctype',
    '<html',
    '<body',
    'cannot post',
    'cannot get',
    'cannot put',
    'cannot delete',
    'cannot patch',
    'bad gateway',
    'internal server error',
    'not found',
    'method not allowed',
  ];

  const lower = trimmed.toLowerCase();
  return !technicalPatterns.some(pattern => lower.includes(pattern));
}

export function getBackendErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Verifique sua internet.';
    }

    const { status, data } = error.response;
    const payload = data as { message?: unknown; error?: unknown } | string | undefined;

    if (status === 404 || status === 405) {
      return 'O serviço de acesso está indisponível no momento. Tente novamente em instantes.';
    }

    if (status >= 500) {
      return 'Nosso sistema está temporariamente indisponível. Tente novamente mais tarde.';
    }

    if (isCleanMessage(payload)) return payload.trim();
    if (typeof payload === 'object' && payload !== null) {
      if (isCleanMessage(payload.message)) return payload.message.trim();
      if (isCleanMessage(payload.error)) return payload.error.trim();
    }
    if (status === 400) {
      return 'Dados inválidos. Verifique as informações preenchidas.';
    }

    if (status === 401) {
      return 'Matrícula ou senha inválida.';
    }

    if (status === 403) {
      return 'Você não tem permissão para acessar o aplicativo.';
    }

    if (status === 429) {
      return 'Muitas tentativas seguidas. Aguarde um momento antes de tentar novamente.';
    }
  }

  return 'Não foi possível concluir a operação. Tente novamente.';
}

export async function login(matricula: string, password: string) {
  try {
    const response = await api.post('/auth/login/mobile', {
      matricula,
      senha: password,
    });

    const token = response.data?.token;
    if (typeof token !== 'string' || !token) {
      throw new Error('Não foi possível iniciar a sessão no aplicativo.');
    }

    await SecureStore.setItemAsync('authToken', token);
    return response.data;
  } catch (error) {
    console.log('Falha na requisição de login:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}
