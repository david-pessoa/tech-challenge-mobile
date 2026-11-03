import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import UserList from '../screens/UserList';
import { useLocalSearchParams } from 'expo-router';

const mockSetParams = jest.fn();
import { useUser } from '../context/AuthContext';
import { deleteUser, getAllUsers } from '../services/user.service';
import type { UserListItem } from '../types/UserList';

jest.mock('../context/AuthContext', () => ({ useUser: jest.fn() }));
jest.mock('../services/user.service', () => ({ getAllUsers: jest.fn(), deleteUser: jest.fn() }));
jest.mock('../components/Header', () => () => null);
jest.mock('../components/Footer', () => () => null);
jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useLocalSearchParams: jest.fn(),
  useRouter: () => ({ setParams: mockSetParams }),
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('../styles/GlobalStyles', () => {
  const { View, ScrollView } = require('react-native');
  return { Screen: View, Scroll: ScrollView };
});

const users = Array.from({ length: 13 }, (_, index) => ({
  id: String(index + 1), nome: `Aluno ${index + 1}`, matricula: String(index + 1),
  role: 'ALUNO' as const, birthDate: null, image: null,
}));

const adminUser: UserListItem = { id: 'admin-1', nome: 'Administrador', matricula: '999', role: 'ADMIN', birthDate: null, image: null };
let currentUsers: UserListItem[];
const mockSignOut = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  currentUsers = [...users, adminUser];
  jest.mocked(deleteUser).mockImplementation(async id => {
    currentUsers = currentUsers.filter(user => user.id !== id);
    return { message: 'Usuário deletado com sucesso' };
  });
  jest.mocked(useLocalSearchParams).mockReturnValue({});
  jest.mocked(useUser).mockReturnValue({
    user: { id: 'professor-1', nome: 'Professor', matricula: '123', role: 'PROFESSOR' },
    isLoading: false, userImageCacheKey: 0, refreshUser: jest.fn(), signIn: jest.fn(), signOut: jest.fn(),
  });
  jest.mocked(getAllUsers).mockImplementation(async params => {
    const page = params?.p ?? 1;
    const length = params?.l ?? 10;
    const filteredUsers = currentUsers.filter(user => user.role === params?.role);
    return {
      users: filteredUsers.slice((page - 1) * length, page * length),
      pagination: { currentPage: page, totalPages: Math.ceil(filteredUsers.length / length), pageLength: length, totalItems: filteredUsers.length },
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

it.each([
  ['created', 'Usuário cadastrado com sucesso!'],
  ['updated', 'Usuário atualizado com sucesso!'],
])('Exibe confirmação na listagem após o resultado %s', async (result, message) => {
  jest.mocked(useLocalSearchParams).mockReturnValue({ result });
  await render(<UserList />);
  await waitFor(() => expect(screen.getByText(message)).toBeTruthy());
  expect(mockSetParams).toHaveBeenCalledWith({ result: undefined });
  await fireEvent.press(screen.getByLabelText('Fechar notificação'));
  expect(screen.queryByText(message)).toBeNull();
});

async function openAdminList() {
  jest.mocked(useUser).mockReturnValue({
    user: { id: adminUser.id, nome: adminUser.nome, matricula: adminUser.matricula, role: adminUser.role },
    isLoading: false, userImageCacheKey: 0, refreshUser: jest.fn(), signIn: jest.fn(), signOut: mockSignOut,
  });
  await render(<UserList />);
  await waitFor(() => expect(screen.getByText('Aluno 1')).toBeTruthy());
}

describe('Exclusão de usuários', () => {
  it('Professor não tem acesso ao botão de excluir', async () => {
    await render(<UserList />);
    await waitFor(() => expect(screen.getByText('Aluno 1')).toBeTruthy());
    expect(screen.queryByLabelText('Excluir Aluno 1')).toBeNull();
    expect(screen.queryByLabelText('Confirmar exclusão')).toBeNull();
    expect(deleteUser).not.toHaveBeenCalled();
  });

  it('Pede confirmação e mantém o usuário quando a exclusão é cancelada', async () => {
    await openAdminList();
    await fireEvent.press(screen.getByLabelText('Excluir Aluno 1'));
    expect(screen.getByText('Deseja excluir Aluno 1? Esta ação não pode ser desfeita.')).toBeTruthy();
    expect(deleteUser).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByLabelText('Cancelar exclusão'));
    expect(screen.getByText('Aluno 1')).toBeTruthy();
    expect(screen.queryByLabelText('Confirmar exclusão')).toBeNull();
    expect(deleteUser).not.toHaveBeenCalled();
  });

  it('Exclui o usuário confirmado, atualiza o total e mostra o toast', async () => {
    await openAdminList();
    await fireEvent.press(screen.getByLabelText('Excluir Aluno 1'));
    await fireEvent.press(screen.getByLabelText('Confirmar exclusão'));
    await waitFor(() => expect(screen.getByText('1–5 de 12')).toBeTruthy());
    expect(deleteUser).toHaveBeenCalledWith('1');
    expect(screen.queryByText('Aluno 1')).toBeNull();
    expect(screen.getByText('Usuário excluído com sucesso!')).toBeTruthy();
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it('Mantém o usuário na tabela e mostra o erro quando a API recusa a exclusão', async () => {
    jest.mocked(deleteUser).mockRejectedValueOnce(new Error('Não foi possível excluir o usuário.'));
    await openAdminList();
    await fireEvent.press(screen.getByLabelText('Excluir Aluno 1'));
    await fireEvent.press(screen.getByLabelText('Confirmar exclusão'));
    expect(screen.getByText('Não foi possível excluir o usuário.')).toBeTruthy();
    expect(screen.getByText('Aluno 1')).toBeTruthy();
    expect(screen.getByText('1–5 de 13')).toBeTruthy();
  });

  it('Retorna à página anterior ao excluir o último registro da última página', async () => {
    currentUsers = users.slice(0, 6);
    await openAdminList();
    await fireEvent.press(screen.getByLabelText('Próxima página de alunos'));
    await waitFor(() => expect(screen.getByText('6–6 de 6')).toBeTruthy());
    await fireEvent.press(screen.getByLabelText('Excluir Aluno 6'));
    await fireEvent.press(screen.getByLabelText('Confirmar exclusão'));
    await waitFor(() => expect(screen.getByText('1–5 de 5')).toBeTruthy());
    expect(screen.getByLabelText('Próxima página de alunos')).toBeDisabled();
    expect(screen.queryByText('Aluno 6')).toBeNull();
  });

  it('Bloqueia novos cliques enquanto aguarda a exclusão', async () => {
    let complete!: (value: unknown) => void;
    jest.mocked(deleteUser).mockReturnValueOnce(new Promise(resolve => { complete = resolve; }));
    await openAdminList();
    await fireEvent.press(screen.getByLabelText('Excluir Aluno 1'));
    const submission = fireEvent.press(screen.getByLabelText('Confirmar exclusão'));
    await waitFor(() => expect(screen.getByLabelText('Confirmar exclusão')).toBeDisabled());
    expect(screen.getByLabelText('Cancelar exclusão')).toBeDisabled();
    await fireEvent.press(screen.getByLabelText('Confirmar exclusão'));
    expect(deleteUser).toHaveBeenCalledTimes(1);
    await act(async () => { complete({ message: 'Usuário deletado com sucesso' }); });
    await submission;
  });

  it('Oculta a exclusão da própria conta e mantém a de outros administradores', async () => {
    currentUsers.push({ ...adminUser, id: 'admin-2', nome: 'Outro admin' });
    await openAdminList();
    expect(screen.getByLabelText('Editar Administrador')).toBeTruthy();
    expect(screen.queryByLabelText('Excluir Administrador')).toBeNull();
    expect(screen.getByLabelText('Excluir Outro admin')).toBeTruthy();
    expect(deleteUser).not.toHaveBeenCalled();
  });
});

it.each([
  ['Ana Santos', 'Ana Santos'],
  ['Ana Santosa', 'Ana Santos...'],
  ['Maria Aparecida Silva', 'Maria Apar...'],
])('Limita o nome %s sem alterar os nomes completos das ações', async (nome, displayedName) => {
  currentUsers = [{ ...users[0], nome }];
  await render(<UserList />);
  await waitFor(() => expect(screen.getByText(displayedName)).toBeTruthy());
  expect(screen.getByLabelText(`Editar ${nome}`)).toBeTruthy();
  expect(screen.getByLabelText(`Foto de ${nome}`)).toBeTruthy();
});
