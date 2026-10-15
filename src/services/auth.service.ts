import axios from 'axios';
import { api } from './api';


export function getBackendErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: unknown; error?: unknown }
      | string
      | undefined;

    if (typeof data === 'string') return data;
    if (typeof data?.message === 'string') return data.message;
    if (typeof data?.error === 'string') return data.error;

    if (error.response?.status === 500) {
      return 'Ocorreu um erro interno no servidor.';
    }
  }

  return 'Não foi possível concluir a operação.';
}

export async function login(matricula: string, password: string) {
  try {
    const response = await api.post('/auth/login', {
      matricula,
      senha: password,
    });
    return response.data;
  } catch (error) {
    console.error('Erro de login:', error);
    throw new Error(getBackendErrorMessage(error))
  }
}

export async function logout() {
  await api.post('/auth/logout');
}
