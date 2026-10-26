import axios from 'axios';
import { getToken } from '../utils/tokenStorage';

/**
 * Instância do axios usada por todos os serviços.
 *
 * O back-end devolve o JWT no corpo da resposta do login (não usa cookies),
 * então o token é guardado no dispositivo (veja utils/tokenStorage.ts) e
 * enviado em todas as requisições no header Authorization.
 */
export const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BASE_URL}/api`,
});

// Interceptor de requisição: antes de cada chamada, lê o token salvo e,
// se existir, anexa "Authorization: Bearer <token>".
api.interceptors.request.use(async config => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
