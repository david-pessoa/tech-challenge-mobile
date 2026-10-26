import axios from 'axios';
import { api } from './api';
import { clearToken } from '../utils/tokenStorage';

/**
 * Extrai uma mensagem amigável de um erro vindo do back-end.
 * Se não for um erro do axios (ou não tiver mensagem), devolve um texto genérico.
 */
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

    // Sem response = a requisição nem chegou no servidor (API fora do ar, sem rede...)
    if (!error.response) {
      return 'Não foi possível conectar ao servidor.';
    }
  }

  return 'Não foi possível concluir a operação.';
}

/** Resposta do POST /api/auth/login */
export type LoginResponse = {
  message: string;
  token: string;
  usuario: {
    id: string;
    nome: string;
    matricula: string;
    role: string;
  };
};

/**
 * Faz login. Em caso de sucesso devolve { token, usuario }.
 * Em caso de erro lança um Error com a mensagem já tratada.
 */
export async function login(matricula: string, password: string): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      matricula,
      senha: password,
    });
    return response.data;
  } catch (error) {
    console.error('Erro de login:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}

/**
 * Logout. O back-end não tem rota de logout (o JWT é "stateless"),
 * então basta apagar o token do dispositivo.
 */
export async function logout() {
  await clearToken();
}
