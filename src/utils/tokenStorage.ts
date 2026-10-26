import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Armazenamento do token JWT no dispositivo.
 *
 * - Android/iOS: usa o expo-secure-store (Keychain / Keystore), que guarda
 *   o dado criptografado. Diferente do localStorage da web, o React Native
 *   não tem localStorage, então precisamos dessa biblioteca.
 * - Web (npm run web): o SecureStore não existe, então usamos o localStorage
 *   do navegador como alternativa, só pra conseguir testar no browser.
 */
// O SecureStore só aceita letras, números, ".", "-" e "_" na chave (sem ":").
const TOKEN_KEY = 'edify.token';

export async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
