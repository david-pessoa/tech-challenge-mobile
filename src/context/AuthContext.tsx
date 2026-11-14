import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { login as loginRequest } from '../services/auth.service';
import { getMe } from '../services/user.service';
import type { User } from '../types/User';
import * as SecureStore from 'expo-secure-store';

type UserContextType = {
  user: User | undefined;
  isLoading: boolean;
  userImageCacheKey: number;
  refreshUser: (options?: { refreshImage?: boolean }) => Promise<void>;
  signIn: (matricula: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  user: undefined,
  isLoading: true,
  userImageCacheKey: 0,
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
  } catch {
    await SecureStore.deleteItemAsync('authToken');
    setUser(undefined);
  } finally {
    setIsLoading(false);
  }
}

  async function signIn(matricula: string, senha: string) {
    await loginRequest(matricula, senha);
    await refreshUser();
  }

  async function signOut() {
    try {
      await SecureStore.deleteItemAsync('authToken');
    } catch (error) {
      console.error('Erro ao realizar o logout:', error);
    } finally {
      setUser(undefined);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, isLoading, userImageCacheKey, refreshUser, signIn, signOut }}
    >
      {children}
    </UserContext.Provider>
  );
}
