import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getMe } from '../services/user.service';
import { login as loginRequest, logout as logoutRequest } from '../services/auth.service';
import { getToken, setToken } from '../utils/tokenStorage';
import type { User } from '../types/User';

/**
 * Tudo que as telas podem ler/chamar através do contexto de autenticação.
 */
type UserContextType = {
  /** Usuário logado (undefined = ninguém logado) */
  user: User | undefined;
  /** true enquanto verificamos se existe uma sessão salva */
  isLoading: boolean;
  /** Muda a cada atualização de foto, pra forçar o recarregamento da imagem */
  userImageCacheKey: number;
  /** Busca o usuário logado de novo no back-end */
  refreshUser: (options?: { refreshImage?: boolean }) => Promise<void>;
  /** Autentica, guarda o token e carrega o usuário. Lança Error se falhar. */
  signIn: (matricula: string, senha: string) => Promise<void>;
  /** Apaga o token e desloga o usuário */
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
   * Carrega o usuário logado. Se não houver token salvo (ou ele for
   * inválido/expirado), o usuário fica como undefined e as rotas
   * protegidas redirecionam para /login.
   */
  async function refreshUser(options?: { refreshImage?: boolean }) {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setUser(undefined);
      } else {
        const userData = await getMe();
        setUser(userData);
        if (options?.refreshImage) {
          setUserImageCacheKey(Date.now());
        }
      }
    } catch (error) {
      console.error(error);
      setUser(undefined);
    }
    setIsLoading(false);
  }

  /**
   * Fluxo de login: chama a API, salva o token no dispositivo e
   * carrega os dados do usuário. Os erros sobem para a tela de login.
   */
  async function signIn(matricula: string, senha: string) {
    const { token } = await loginRequest(matricula, senha);
    await setToken(token);
    await refreshUser();
  }

  async function signOut() {
    await logoutRequest();
    setUser(undefined);
  }

  // Ao abrir o app, tenta restaurar a sessão a partir do token salvo
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
