import axios from 'axios';
import { Platform } from 'react-native';

export const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BASE_URL}/api`,
  withCredentials: true,
});

// Login temporario
api.interceptors.request.use(config => {
  if (!__DEV__ || Platform.OS !== 'web' || typeof window === 'undefined') {
    return config;
  }

  if (config.url?.startsWith('/auth/')) return config;

  try {
    const token = window.localStorage.getItem('token')?.trim();

    if (token && !config.headers.has('Authorization')) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  } catch {
    return config;
  }

  return config;
});
