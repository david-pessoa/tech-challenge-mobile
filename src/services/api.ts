import axios from 'axios';

/**
 * O access/refresh token fica em um cookie HttpOnly definido pelo backend.
 * Portanto, o frontend não precisa (e não deve) ler o token.
 */
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  withCredentials: true,
});
