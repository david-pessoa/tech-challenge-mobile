import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  ignoreUnauthorizedResponses,
  resumeUnauthorizedHandling,
  setUnauthorizedHandler,
} from '../services/api';
import { login as loginRequest } from '../services/auth.service';
import { getMe } from '../services/user.service';
import type { User } from '../types/User';

type UserContextType = {
  user: User | undefined;
  isLoading: boolean;
  userImageCacheKey: number;
  // true quando a sessão acabou por expiração (não por logout do usuário)
  sessionExpired: boolean;
  clearSessionExpired: () => void;
  refreshUser: (options?: { refreshImage?: boolean }) => Promise<void>;
  signIn: (matricula: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  user: undefined,
  isLoading: true,
  userImageCacheKey: 0,
  sessionExpired: false,
  clearSessionExpired: () => {},
  refreshUser: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export function useUser() {
  return useContext(UserContext);
}

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userImageCacheKey, setUserImageCacheKey] = useState(0);
  const [sessionExpired, setSessionExpired] = useState(false);

  async function refreshUser(options?: { refreshImage?: boolean }) {
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        setUser(undefined);
        return;
      }
      const userData = await getMe();
      setUser(userData);
      if (options?.refreshImage) {
        setUserImageCacheKey(Date.now());
      }
    } catch (error) {
      await SecureStore.deleteItemAsync('authToken');
      setUser(undefined);
      // Havia token guardado e o servidor respondeu 401: a sessão expirou.
      // (O interceptor ignora o 401 do /user/me, então tratamos aqui.)
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setSessionExpired(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(matricula: string, senha: string) {
    // Novo login: volta a tratar 401 normalmente e limpa o aviso anterior
    resumeUnauthorizedHandling();
    setSessionExpired(false);
    await loginRequest(matricula, senha);
    await refreshUser();
  }

  async function signOut() {
    // Logout feito pelo usuário não é erro: ignora 401 de requisições
    // que ainda estavam em andamento e não mostra aviso de expiração
    ignoreUnauthorizedResponses();
    setSessionExpired(false);
    try {
      await SecureStore.deleteItemAsync('authToken');
    } catch (error) {
      console.error('Erro ao realizar o logout:', error);
    } finally {
      setUser(undefined);
    }
  }

  function clearSessionExpired() {
    setSessionExpired(false);
  }

  useEffect(() => {
    // Quando o interceptor detecta 401 com token (sessão expirada),
    // zera o usuário: as rotas protegidas redirecionam para o login
    setUnauthorizedHandler(() => {
      setUser(undefined);
      setSessionExpired(true);
    });

    refreshUser();

    return () => setUnauthorizedHandler(undefined);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        userImageCacheKey,
        sessionExpired,
        clearSessionExpired,
        refreshUser,
        signIn,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
