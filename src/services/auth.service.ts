import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { api } from './api';

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

/**
 * Faz login mobile e persiste o JWT no armazenamento seguro do dispositivo.
 * Em caso de erro lança um Error com a mensagem já tratada.
 */
export async function login(matricula: string, password: string) {
  try {
    const response = await api.post('/auth/login/mobile', {
      matricula,
      senha: password,
    });

    const token = response.data?.token;
    if (typeof token !== 'string' || !token) {
      throw new Error('A resposta de login não contém um token válido.');
    }

    await SecureStore.setItemAsync('authToken', token);
    return response.data;
  } catch (error) {
    console.error('Erro de login:', error);
    throw new Error(getBackendErrorMessage(error));
  }
}
