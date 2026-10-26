import axios from 'axios';

export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

/**
 * Instância do axios usada por todos os serviços.
 *
 * O back-end guarda o JWT num cookie HttpOnly chamado "session" (definido no
 * login e removido no logout). O app não lê nem guarda o token: com
 * `withCredentials: true`, o sistema (Android/iOS/navegador) armazena o cookie
 * e o envia automaticamente em toda requisição para a API.
 */
export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});
