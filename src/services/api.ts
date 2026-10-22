import axios from 'axios';

/**
 * O access/refresh token fica em um cookie HttpOnly definido pelo backend.
 * Portanto, o frontend não precisa (e não deve) ler o token.
 */

export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});
