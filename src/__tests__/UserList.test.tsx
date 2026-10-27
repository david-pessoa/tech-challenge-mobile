import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import UserList from '../screens/UserList';
import { useUser } from '../context/AuthContext';
import { getAllUsers } from '../services/user.service';

jest.mock('../context/AuthContext', () => ({ useUser: jest.fn() }));
jest.mock('../services/user.service', () => ({ getAllUsers: jest.fn() }));
jest.mock('../components/Header', () => () => null);
jest.mock('../components/Footer', () => () => null);
jest.mock('expo-router', () => ({ Link: ({ children }: { children: React.ReactNode }) => children }));
jest.mock('../styles/GlobalStyles', () => {
  const { View, ScrollView } = require('react-native');
  return { Screen: View, Scroll: ScrollView };
});
jest.mock('@material-symbols-svg/react-native', () => {
  const Icon = () => null;
  return { Add: Icon, ArrowBack: Icon, ChevronLeft: Icon, ChevronRight: Icon, Delete: Icon, Edit: Icon, KeyboardArrowDown: Icon };
}, { virtual: true });

const users = Array.from({ length: 13 }, (_, index) => ({
  id: String(index + 1), nome: `Aluno ${index + 1}`, matricula: String(index + 1),
  role: 'ALUNO' as const, birthDate: null, image: null,
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useUser).mockReturnValue({
    user: { id: 'professor-1', nome: 'Professor', matricula: '123', role: 'PROFESSOR' },
    isLoading: false, userImageCacheKey: 0, refreshUser: jest.fn(),
  });
  jest.mocked(getAllUsers).mockImplementation(async params => {
    const page = params?.p ?? 1;
    const length = params?.l ?? 10;
    return {
      users: users.slice((page - 1) * length, page * length),
      pagination: { currentPage: page, totalPages: Math.ceil(users.length / length), pageLength: length, totalItems: users.length },
    };
  });
});

it('Mostra cinco usuários por padrão e o intervalo com o total de registros', async () => {
  await render(<UserList />);
  await waitFor(() => expect(screen.getByText('1–5 de 13')).toBeTruthy());
  expect(screen.getByLabelText('Quantidade de alunos por página')).toHaveAccessibilityValue({ text: '5' });
  expect(screen.getByText('Aluno 5')).toBeTruthy();
  expect(getAllUsers).toHaveBeenCalledTimes(1);
  expect(screen.queryByText('Aluno 6')).toBeNull();
  expect(screen.getByLabelText('Página anterior de alunos')).toBeDisabled();
});

it('Atualiza o intervalo ao avançar e bloqueia a próxima página no fim da lista', async () => {
  await render(<UserList />);
  await waitFor(() => expect(screen.getByText('1–5 de 13')).toBeTruthy());
  await fireEvent.press(screen.getByLabelText('Próxima página de alunos'));
  await waitFor(() => expect(screen.getByText('6–10 de 13')).toBeTruthy());
  expect(screen.queryByText('Aluno 1')).toBeNull();
  await fireEvent.press(screen.getByLabelText('Próxima página de alunos'));
  await waitFor(() => expect(screen.getByText('11–13 de 13')).toBeTruthy());
  expect(screen.getByLabelText('Próxima página de alunos')).toBeDisabled();
});

it('Retorna ao início ao selecionar dez itens por página', async () => {
  await render(<UserList />);
  await waitFor(() => expect(screen.getByText('1–5 de 13')).toBeTruthy());
  await fireEvent.press(screen.getByLabelText('Próxima página de alunos'));
  await waitFor(() => expect(screen.getByText('6–10 de 13')).toBeTruthy());
  await fireEvent.press(screen.getByLabelText('Quantidade de alunos por página'));
  await fireEvent.press(screen.getByRole('radio', { name: 'Mostrar 10 itens' }));
  await waitFor(() => expect(screen.getByText('1–10 de 13')).toBeTruthy());
  expect(screen.getByLabelText('Quantidade de alunos por página')).toHaveAccessibilityValue({ text: '10' });
  expect(screen.getByText('Aluno 10')).toBeTruthy();
  expect(screen.queryByText('Aluno 11')).toBeNull();
});
