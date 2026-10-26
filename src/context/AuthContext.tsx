import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getMe } from '../services/user.service';
import { login as loginRequest, logout as logoutRequest } from '../services/auth.service';
import type { User } from '../types/User';

/**
 * Tudo que as telas podem ler/chamar através do contexto de autenticação.
 */
type UserContextType = {
  /** Usuário logado (undefined = ninguém logado) */
  user: User | undefined;
  /** true enquanto verificamos se existe uma sessão ativa */
  isLoading: boolean;
  /** Muda a cada atualização de foto, pra forçar o recarregamento da imagem */
  userImageCacheKey: number;
  /** Busca o usuário logado de novo no back-end */
  refreshUser: (options?: { refreshImage?: boolean }) => Promise<void>;
  /** Faz login (o back-end grava o cookie) e carrega o usuário. Lança Error se falhar. */
  signIn: (matricula: string, senha: string) => Promise<void>;
  /** Faz logout (o back-end remove o cookie) e zera o usuário */
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

/** Hook de atalho: const { user, signIn } = useUser(); */
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

  /**
   * Carrega o usuário logado via GET /user/me. O cookie de sessão é enviado
   * automaticamente; se não houver sessão (ou ela expirou), a API responde 401,
   * o `user` fica undefined e as rotas protegidas redirecionam para /login.
   */
  async function refreshUser(options?: { refreshImage?: boolean }) {
    setIsLoading(true);
    try {
      const userData = await getMe();
      setUser(userData);
      if (options?.refreshImage) {
        setUserImageCacheKey(Date.now());
      }
    } catch {
      // Sem sessão válida: é o caso normal de quem ainda não fez login
      setUser(undefined);
    }
    setIsLoading(false);
  }

  /** Login: a API grava o cookie e em seguida carregamos o usuário. */
  async function signIn(matricula: string, senha: string) {
    await loginRequest(matricula, senha);
    await refreshUser();
  }

  /** Logout: a API remove o cookie. Mesmo se a chamada falhar, limpamos o estado local. */
  async function signOut() {
    try {
      await logoutRequest();
    } finally {
      setUser(undefined);
    }
  }

  // Ao abrir o app, tenta restaurar a sessão a partir do cookie
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
