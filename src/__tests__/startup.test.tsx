import { render, screen } from '@testing-library/react-native';
import { Redirect } from 'expo-router';
import { ThemeProvider } from 'styled-components/native';
import Index from '../app/index';
import { useUser } from '../context/AuthContext';
import { theme } from '../styles/Theme';

jest.mock('../context/AuthContext', () => ({ useUser: jest.fn() }));
jest.mock('expo-router', () => ({ Redirect: jest.fn(() => null) }));

const mockUseUser = jest.mocked(useUser);

function setSession(user: ReturnType<typeof useUser>['user'], isLoading: boolean) {
  mockUseUser.mockReturnValue({
    user,
    isLoading,
    userImageCacheKey: 0,
    refreshUser: jest.fn(), signIn: jest.fn(), signOut: jest.fn(),
  });
}

async function renderIndex() {
  await render(
    <ThemeProvider theme={theme}>
      <Index />
    </ThemeProvider>
  );
}

beforeEach(() => jest.clearAllMocks());

it('Exibe o carregamento enquanto verifica a sessão', async () => {
  setSession(undefined, true);
  await renderIndex();
  expect(screen.getByText('Verificando acessos...')).toBeTruthy();
  expect(screen.getByLabelText('Carregando sessão')).toBeTruthy();
  expect(Redirect).not.toHaveBeenCalled();
});

it('Redireciona o visitante sem sessão para o login', async () => {
  setSession(undefined, false);
  await renderIndex();
  expect(jest.mocked(Redirect).mock.calls[0][0].href).toBe('/login');
});

it('Redireciona o usuário autenticado para a home', async () => {
  setSession({ id: 'user-1', matricula: '123', nome: 'Aluno', role: 'ALUNO' }, false);
  await renderIndex();
  expect(jest.mocked(Redirect).mock.calls[0][0].href).toBe('/home');
});
