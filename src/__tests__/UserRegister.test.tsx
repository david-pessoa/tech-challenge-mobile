import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Redirect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import UserRegister from '../screens/UserRegister';
import { useUser } from '../context/AuthContext';
import { createUser, getUserById, updateUser } from '../services/user.service';
import type { Role } from '../types/Roles';
import { ReactElement } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { theme } from '@/styles/Theme';

const mockReplace = jest.fn();
const originalFormData = globalThis.FormData;

beforeAll(() => {
  globalThis.FormData = jest.requireActual('react-native/Libraries/Network/FormData').default;
});
afterAll(() => { globalThis.FormData = originalFormData; });

jest.mock('../context/AuthContext', () => ({ useUser: jest.fn() }));
jest.mock('../services/user.service', () => ({ createUser: jest.fn(), getUserById: jest.fn(), updateUser: jest.fn() }));
jest.mock('expo-router', () => ({
  Redirect: jest.fn(() => null),
  useRouter: () => ({ replace: mockReplace }),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  usePathname: () => '/home',
}));
jest.mock('expo-font', () => ({ useFonts: () => [true, null] }));
jest.mock('@expo/vector-icons/Ionicons', () => ({
  __esModule: true,
  default: Object.assign(() => null, { font: {} }),
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('expo-image-picker', () => ({ launchImageLibraryAsync: jest.fn() }));
jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: (props: object) => <View {...props} testID="birth-date-picker" /> };
});

jest.mock(
  '@material-symbols-svg/react-native',
  () => {
    const MockIcon = () => null;

    return {
      CalendarMonth: MockIcon,
      Close: MockIcon,
      Cancel: MockIcon,
      ArrowBack: MockIcon,
      Check: MockIcon,
      KeyboardArrowDown: MockIcon,
      Visibility: MockIcon,
      VisibilityOff: MockIcon,
      Download: MockIcon,
      Logout: MockIcon
    };
  },
  { virtual: true },
);


const mockUseUser = jest.mocked(useUser);
const mockCreateUser = jest.mocked(createUser);
const mockPickPhoto = jest.mocked(ImagePicker.launchImageLibraryAsync);
const photo: ImagePicker.ImagePickerAsset = {
  uri: 'file:///foto.png', width: 200, height: 200,
  fileName: 'foto.png', mimeType: 'image/png', fileSize: 1024,
};

function setSession(role: Role = 'ADMIN') {
  mockUseUser.mockReturnValue({
    user: { id: 'usuario-1', nome: 'Usuário', matricula: '123', role },
    isLoading: false, userImageCacheKey: 0, refreshUser: jest.fn(), signIn: jest.fn(), signOut: jest.fn(),
  });
}

async function selectRole(label = 'Aluno') {
  await fireEvent.press(screen.getByLabelText('Tipo de acesso'));
  await fireEvent.press(screen.getByRole('radio', { name: label }));
}

async function fillForm() {
  await fireEvent.changeText(screen.getByLabelText('Nome completo'), 'Serena Ramos');
  await fireEvent.changeText(screen.getByLabelText('Matrícula'), '935374');
  await fireEvent.changeText(screen.getByLabelText('Senha'), 'Senha123@');
  await fireEvent.changeText(screen.getByLabelText('Confirme sua senha'), 'Senha123@');
}

async function selectPhoto(asset = photo) {
  mockPickPhoto.mockResolvedValueOnce({ canceled: false, assets: [asset] });
  await fireEvent.press(screen.getByLabelText('Selecionar foto do usuário'));
}

function sentParts() {
  const form = mockCreateUser.mock.calls[0][0] as unknown as {
    getParts(): { fieldName: string; string?: string; uri?: string; type?: string; name?: string }[];
  };
  return form.getParts();
}

function renderWithTheme(component: ReactElement) {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
}

beforeEach(() => {
  jest.resetAllMocks();
  setSession();
  mockCreateUser.mockResolvedValue({ id: 'novo-usuario' });
});

describe('Permissões do cadastro', () => {
  it.each(['Aluno', 'Professor', 'Administrador'])('Administrador consegue selecionar o perfil %s', async label => {
    await renderWithTheme(<UserRegister />);
    await selectRole(label);
    expect(screen.getByLabelText('Tipo de acesso')).toHaveAccessibilityValue({ text: label });
  });

  it('Professor tem apenas o perfil de aluno e envia o cadastro com essa permissão', async () => {
    setSession('PROFESSOR');
    await renderWithTheme(<UserRegister />);
    expect(screen.getByLabelText('Tipo de acesso')).toBeDisabled();
    expect(screen.getByLabelText('Tipo de acesso')).toHaveAccessibilityValue({ text: 'Aluno' });
    await fireEvent.press(screen.getByLabelText('Tipo de acesso'));
    expect(screen.queryByRole('radio', { name: 'Professor' })).toBeNull();
    expect(screen.queryByRole('radio', { name: 'Administrador' })).toBeNull();
    await fillForm();
    await fireEvent.press(screen.getByLabelText('Enviar'));
    expect(sentParts()).toEqual(expect.arrayContaining([expect.objectContaining({ fieldName: 'role', string: 'ALUNO' })]));
  });

  it('Aluno é redirecionado para a home sem acessar o formulário', async () => {
    setSession('ALUNO');
    await renderWithTheme(<UserRegister />);
    expect(jest.mocked(Redirect).mock.calls[0][0].href).toBe('/home');
    expect(screen.queryByLabelText('Enviar')).toBeNull();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('Visitante sem sessão é redirecionado para o login', async () => {
    mockUseUser.mockReturnValue({ user: undefined, isLoading: false, userImageCacheKey: 0, refreshUser: jest.fn(), signIn: jest.fn(), signOut: jest.fn() });
    await renderWithTheme(<UserRegister />);
    expect(jest.mocked(Redirect).mock.calls[0][0].href).toBe('/login');
    expect(mockCreateUser).not.toHaveBeenCalled();
  });
});

describe('Validações dos campos', () => {
  it('Mostra os campos obrigatórios e impede o envio quando o formulário está vazio', async () => {
    await renderWithTheme(<UserRegister />);
    await fireEvent.press(screen.getByLabelText('Enviar'));
    expect(screen.getByText('O nome completo é obrigatório.')).toBeTruthy();
    expect(screen.getByText('A matrícula é obrigatória.')).toBeTruthy();
    expect(screen.getByText('Selecione o tipo de acesso.')).toBeTruthy();
    expect(screen.getByText('A senha é obrigatória.')).toBeTruthy();
    expect(screen.getByText('Confirme sua senha.')).toBeTruthy();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('Valida a senha obrigatória ao sair do campo sem enviar o formulário', async () => {
    await renderWithTheme(<UserRegister />);
    await fireEvent(screen.getByLabelText('Senha'), 'blur');
    expect(screen.getByText('A senha é obrigatória.')).toBeTruthy();
    expect(screen.queryByText('Confirme sua senha.')).toBeNull();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('Valida a confirmação vazia ao sair do campo', async () => {
    await renderWithTheme(<UserRegister />);
    await fireEvent.changeText(screen.getByLabelText('Senha'), 'Senha123@');
    await fireEvent(screen.getByLabelText('Confirme sua senha'), 'blur');
    expect(screen.getByText('Confirme sua senha.')).toBeTruthy();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('Mostra senhas diferentes ao sair do campo e remove o erro depois da correção', async () => {
    await renderWithTheme(<UserRegister />);
    await fireEvent.changeText(screen.getByLabelText('Senha'), 'Senha123@');
    await fireEvent.changeText(screen.getByLabelText('Confirme sua senha'), 'OutraSenha');
    await fireEvent(screen.getByLabelText('Confirme sua senha'), 'blur');
    expect(screen.getByText('As senhas não coincidem.')).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Senha'), 'OutraSenha');
    await fireEvent(screen.getByLabelText('Senha'), 'blur');
    expect(screen.queryByText('As senhas não coincidem.')).toBeNull();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it.each([
    ['05/01/20', 'Informe a data de nascimento no formato DD/MM/AAAA.'],
    ['31/02/2013', 'Informe uma data de nascimento válida.'],
    ['01/01/2999', 'A data de nascimento não pode ser futura.'],
  ])('Impede o cadastro com a data %s', async (value, message) => {
    await renderWithTheme(<UserRegister />);
    await fillForm();
    await selectRole();
    await fireEvent.changeText(screen.getByLabelText('Data de nascimento'), value);
    await fireEvent.press(screen.getByLabelText('Enviar'));
    expect(screen.getByText(message)).toBeTruthy();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('Converte uma data válida de ano bissexto para o formato aceito pela API', async () => {
    await renderWithTheme(<UserRegister />);
    await fillForm();
    await selectRole();
    await fireEvent.changeText(screen.getByLabelText('Data de nascimento'), '29/02/2012');
    await fireEvent.press(screen.getByLabelText('Enviar'));
    expect(sentParts()).toEqual(expect.arrayContaining([expect.objectContaining({ fieldName: 'birthDate', string: '2012-02-29' })]));
  });
});

describe('Foto e envio do cadastro', () => {
  it('Permite selecionar e remover uma foto sem abrir a galeria novamente', async () => {
    await renderWithTheme(<UserRegister />);
    await selectPhoto();
    expect(screen.getByLabelText('Trocar foto do usuário')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Remover foto do usuário'));
    expect(screen.getByLabelText('Selecionar foto do usuário')).toBeTruthy();
    expect(screen.queryByLabelText('Remover foto do usuário')).toBeNull();
    expect(mockPickPhoto).toHaveBeenCalledTimes(1);
  });

  it('Mantém a foto anterior quando a troca é cancelada', async () => {
    await renderWithTheme(<UserRegister />);
    await selectPhoto();
    mockPickPhoto.mockResolvedValueOnce({ canceled: true, assets: null });
    await fireEvent.press(screen.getByLabelText('Trocar foto do usuário'));
    await fillForm();
    await selectRole();
    await fireEvent.press(screen.getByLabelText('Enviar'));
    expect(sentParts()).toEqual(expect.arrayContaining([expect.objectContaining({ fieldName: 'image', uri: photo.uri })]));
  });

  it('Envia a foto e limpa os campos e a imagem depois do cadastro bem-sucedido', async () => {
    await renderWithTheme(<UserRegister />);
    await fillForm();
    await selectRole('Professor');
    await selectPhoto();
    await fireEvent.press(screen.getByLabelText('Enviar'));
    expect(mockCreateUser).toHaveBeenCalledTimes(1);
    expect(sentParts()).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldName: 'nome', string: 'Serena Ramos' }),
      expect.objectContaining({ fieldName: 'matricula', string: '935374' }),
      expect.objectContaining({ fieldName: 'role', string: 'PROFESSOR' }),
      expect.objectContaining({ fieldName: 'image', uri: photo.uri, name: 'foto.png', type: 'image/png' }),
    ]));
    for (const label of ['Nome completo', 'Matrícula', 'Senha', 'Confirme sua senha']) {
      expect(screen.getByLabelText(label)).toHaveDisplayValue('');
    }
    expect(screen.getByLabelText('Selecionar foto do usuário')).toBeTruthy();
    expect(mockReplace).toHaveBeenCalledWith({ pathname: '/user-list', params: { result: 'created' } });
  });

  it('Permite cadastrar sem foto e sem data de nascimento', async () => {
    await renderWithTheme(<UserRegister />);
    await fillForm();
    await selectRole();
    await fireEvent.press(screen.getByLabelText('Enviar'));
    expect(sentParts().some(part => part.fieldName === 'image' || part.fieldName === 'birthDate')).toBe(false);
    expect(mockReplace).toHaveBeenCalledWith({ pathname: '/user-list', params: { result: 'created' } });
  });

  it('Impede enviar uma foto acima de 5 MB', async () => {
    await renderWithTheme(<UserRegister />);
    await fillForm();
    await selectRole();
    await selectPhoto({ ...photo, fileSize: 5 * 1024 * 1024 + 1 });
    await fireEvent.press(screen.getByLabelText('Enviar'));
    expect(screen.getByText('A foto deve ter no máximo 5 MB.')).toBeTruthy();
    expect(mockCreateUser).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Enviar')).not.toBeDisabled();
  });

  it('Exibe matrícula duplicada no campo e no toast e mantém os dados preenchidos', async () => {
    mockCreateUser.mockRejectedValueOnce(new Error('Matrícula já cadastrada'));
    await renderWithTheme(<UserRegister />);
    await fillForm();
    await selectRole();
    await selectPhoto();
    await fireEvent.press(screen.getByLabelText('Enviar'));
    expect(screen.getAllByText('Matrícula já cadastrada')).toHaveLength(2);
    expect(screen.getByLabelText('Matrícula')).toHaveDisplayValue('935374');
    expect(screen.getByLabelText('Nome completo')).toHaveDisplayValue('Serena Ramos');
    expect(screen.getByLabelText('Remover foto do usuário')).toBeTruthy();
  });

  it('Apresenta o erro da API e permite tentar novamente sem preencher tudo outra vez', async () => {
    mockCreateUser.mockRejectedValueOnce(new Error('Token não informado'));
    await renderWithTheme(<UserRegister />);
    await fillForm();
    await selectRole();
    await fireEvent.press(screen.getByLabelText('Enviar'));
    expect(screen.getByText('Token não informado')).toBeTruthy();
    expect(screen.getByLabelText('Senha')).toHaveDisplayValue('Senha123@');
    await fireEvent.press(screen.getByLabelText('Enviar'));
    expect(mockCreateUser).toHaveBeenCalledTimes(2);
    expect(mockReplace).toHaveBeenCalledWith({ pathname: '/user-list', params: { result: 'created' } });
  });

  it('Bloqueia novos envios enquanto aguarda a resposta da API', async () => {
    let complete!: (value: unknown) => void;
    mockCreateUser.mockReturnValueOnce(new Promise(resolve => { complete = resolve; }));
    await renderWithTheme(<UserRegister />);
    await fillForm();
    await selectRole();
    const submission = fireEvent.press(screen.getByLabelText('Enviar'));
    await waitFor(() => expect(screen.getByLabelText('Enviar')).toBeDisabled());
    await fireEvent.press(screen.getByLabelText('Enviar'));
    expect(mockCreateUser).toHaveBeenCalledTimes(1);
    await act(async () => { complete({ id: 'novo-usuario' }); });
    await submission;
    expect(mockReplace).toHaveBeenCalledWith({ pathname: '/user-list', params: { result: 'created' } });
  });
});

describe('Carregamento da edição de usuários', () => {
  const selectedUser = {
    id: 'aluno-2', nome: 'Serena Ramos', matricula: '935374',
    role: 'ALUNO' as const, birthDate: '2013-01-05', image: '/api/user/aluno-2/image',
  };

  it('Preenche os dados do usuário selecionado e mantém as senhas vazias', async () => {
    jest.mocked(getUserById).mockResolvedValue(selectedUser);
    await renderWithTheme(<UserRegister userId="aluno-2" />);
    await waitFor(() => expect(screen.getByText('Editar Usuário')).toBeTruthy());
    expect(getUserById).toHaveBeenCalledWith('aluno-2');
    expect(screen.getByLabelText('Nome completo')).toHaveDisplayValue('Serena Ramos');
    expect(screen.getByLabelText('Matrícula')).toHaveDisplayValue('935374');
    expect(screen.getByLabelText('Data de nascimento')).toHaveDisplayValue('05/01/2013');
    expect(screen.getByLabelText('Tipo de acesso')).toHaveAccessibilityValue({ text: 'Aluno' });
    expect(screen.getByLabelText('Senha')).toHaveDisplayValue('');
    expect(screen.getByLabelText('Confirme sua senha')).toHaveDisplayValue('');
    expect(screen.getByLabelText('Trocar foto do usuário')).toBeTruthy();
    expect(screen.getByLabelText('Salvar')).not.toBeDisabled();
    expect(createUser).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByLabelText('Cancelar'));
    expect(mockReplace).toHaveBeenCalledWith('/user-list');
  });

  it('Professor não consegue abrir a edição de outro professor', async () => {
    setSession('PROFESSOR');
    jest.mocked(getUserById).mockResolvedValue({ ...selectedUser, role: 'PROFESSOR' });
    await renderWithTheme(<UserRegister userId="professor-2" />);
    await waitFor(() => expect(screen.getByText('Você só pode editar usuários alunos.')).toBeTruthy());
    expect(screen.queryByLabelText('Nome completo')).toBeNull();
    expect(createUser).not.toHaveBeenCalled();
  });

  it('Permite tentar novamente quando o carregamento falha', async () => {
    jest.mocked(getUserById)
      .mockRejectedValueOnce(new Error('Não foi possível carregar o usuário.'))
      .mockResolvedValueOnce(selectedUser);
    await renderWithTheme(<UserRegister userId="aluno-2" />);
    await waitFor(() => expect(screen.getByText('Não foi possível carregar o usuário.')).toBeTruthy());
    await fireEvent.press(screen.getByText('Tentar novamente'));
    await waitFor(() => expect(screen.getByLabelText('Nome completo')).toHaveDisplayValue('Serena Ramos'));
    expect(getUserById).toHaveBeenCalledTimes(2);
  });
});

it('Volta para a listagem ao cancelar um novo cadastro', async () => {
  await renderWithTheme(<UserRegister />);
  await fireEvent.press(screen.getByLabelText('Cancelar'));
  expect(mockReplace).toHaveBeenCalledWith('/user-list');
  expect(createUser).not.toHaveBeenCalled();
});

describe('Salvamento da edição de usuários', () => {
  const selectedUser = {
    id: 'aluno-2', nome: 'Serena Ramos', matricula: '935374',
    role: 'ALUNO' as const, birthDate: '2013-01-05', image: '/api/user/aluno-2/image',
  };

  async function openEdit() {
    jest.mocked(getUserById).mockResolvedValue(selectedUser);
    await renderWithTheme(<UserRegister userId="aluno-2" />);
    await waitFor(() => expect(screen.getByLabelText('Salvar')).toBeTruthy());
  }

  function updatedParts() {
    const form = jest.mocked(updateUser).mock.calls[0][1] as unknown as {
      getParts(): { fieldName: string; string?: string; uri?: string }[];
    };
    return form.getParts();
  }

  it('Atualiza o usuário sem alterar a senha ou reenviar a foto existente e exibe confirmação', async () => {
    jest.mocked(updateUser).mockResolvedValue(selectedUser);
    await openEdit();
    await fireEvent.changeText(screen.getByLabelText('Nome completo'), 'Serena Almeida');
    await fireEvent.press(screen.getByLabelText('Salvar'));
    expect(updateUser).toHaveBeenCalledWith('aluno-2', expect.any(FormData));
    expect(updatedParts()).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldName: 'nome', string: 'Serena Almeida' }),
      expect.objectContaining({ fieldName: 'birthDate', string: '2013-01-05' }),
    ]));
    expect(updatedParts().some(part => ['senha', 'image', 'removeImage'].includes(part.fieldName))).toBe(false);
    expect(mockReplace).toHaveBeenCalledWith({ pathname: '/user-list', params: { result: 'updated' } });
    expect(screen.getByLabelText('Nome completo')).toHaveDisplayValue('Serena Almeida');
    expect(createUser).not.toHaveBeenCalled();
  });

  it('Mantém os dados e a foto na edição quando a matrícula já existe', async () => {
    jest.mocked(updateUser).mockRejectedValue(new Error('Já existe um usuário cadastrado com essa matrícula'));
    await openEdit();
    await fireEvent.changeText(screen.getByLabelText('Matrícula'), '111111');
    await fireEvent.press(screen.getByLabelText('Salvar'));
    expect(screen.getAllByText('Já existe um usuário cadastrado com essa matrícula')).toHaveLength(2);
    expect(screen.getByLabelText('Matrícula')).toHaveDisplayValue('111111');
    expect(screen.getByLabelText('Trocar foto do usuário')).toBeTruthy();
    expect(screen.getByLabelText('Salvar')).not.toBeDisabled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('Valida nome e matrícula obrigatórios na edição', async () => {
    await openEdit();
    await fireEvent.changeText(screen.getByLabelText('Nome completo'), '');
    await fireEvent.changeText(screen.getByLabelText('Matrícula'), '');
    await fireEvent.press(screen.getByLabelText('Salvar'));
    expect(screen.getByText('O nome completo é obrigatório.')).toBeTruthy();
    expect(screen.getByText('A matrícula é obrigatória.')).toBeTruthy();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('Valida a nova senha ao sair do campo e envia somente quando confirmada', async () => {
    jest.mocked(updateUser).mockResolvedValue(selectedUser);
    await openEdit();
    await fireEvent.changeText(screen.getByLabelText('Senha'), 'NovaSenha123@');
    await fireEvent.changeText(screen.getByLabelText('Confirme sua senha'), 'OutraSenha');
    await fireEvent(screen.getByLabelText('Confirme sua senha'), 'blur');
    expect(screen.getByText('As senhas não coincidem.')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Salvar'));
    expect(updateUser).not.toHaveBeenCalled();
    await fireEvent.changeText(screen.getByLabelText('Confirme sua senha'), 'NovaSenha123@');
    await fireEvent.press(screen.getByLabelText('Salvar'));
    expect(updatedParts()).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldName: 'senha', string: 'NovaSenha123@' }),
    ]));
    expect(screen.getByLabelText('Senha')).toHaveDisplayValue('');
  });

  it('Valida a data de nascimento na edição', async () => {
    await openEdit();
    await fireEvent.changeText(screen.getByLabelText('Data de nascimento'), '31/02/2013');
    await fireEvent.press(screen.getByLabelText('Salvar'));
    expect(screen.getByText('Informe uma data de nascimento válida.')).toBeTruthy();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('Envia a remoção da foto existente ao salvar', async () => {
    jest.mocked(updateUser).mockResolvedValue({ ...selectedUser, image: null });
    await openEdit();
    await fireEvent.press(screen.getByLabelText('Remover foto do usuário'));
    await fireEvent.press(screen.getByLabelText('Salvar'));
    expect(updatedParts()).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldName: 'removeImage', string: 'true' }),
    ]));
    expect(screen.getByLabelText('Selecionar foto do usuário')).toBeTruthy();
  });

  it('Bloqueia novos envios enquanto salva a edição', async () => {
    let complete!: (value: unknown) => void;
    jest.mocked(updateUser).mockReturnValueOnce(new Promise(resolve => { complete = resolve; }));
    await openEdit();
    const submission = fireEvent.press(screen.getByLabelText('Salvar'));
    await waitFor(() => expect(screen.getByLabelText('Salvar')).toBeDisabled());
    await fireEvent.press(screen.getByLabelText('Salvar'));
    expect(updateUser).toHaveBeenCalledTimes(1);
    await act(async () => { complete(selectedUser); });
    await submission;
    expect(mockReplace).toHaveBeenCalledWith({ pathname: '/user-list', params: { result: 'updated' } });
  });
});

describe('Máscara de data de nascimento', () => {
  it.each([
    ['05012013', '05/01/2013'],
    ['a05b01c2013', '05/01/2013'],
    ['05-01.2013', '05/01/2013'],
    ['050120131234', '05/01/2013'],
    ['05/01/2013', '05/01/2013'],
  ])('Formata a entrada %s como %s', async (input, expected) => {
    await renderWithTheme(<UserRegister />);
    await fireEvent.changeText(screen.getByLabelText('Data de nascimento'), input);
    expect(screen.getByLabelText('Data de nascimento')).toHaveDisplayValue(expected);
  });

  it('Insere as barras durante a digitação e permite apagar a data', async () => {
    await renderWithTheme(<UserRegister />);
    const input = screen.getByLabelText('Data de nascimento');
    for (const [value, expected] of [
      ['0', '0'], ['05', '05'], ['050', '05/0'], ['05/01', '05/01'],
      ['05/012', '05/01/2'], ['05/01/201', '05/01/201'], ['05/01/20', '05/01/20'], ['', ''],
    ]) {
      await fireEvent.changeText(input, value);
      expect(input).toHaveDisplayValue(expected);
    }
  });
});

describe('Calendário de nascimento', () => {
  it('Preenche a data selecionada no calendário com o formato DD/MM/AAAA', async () => {
    await renderWithTheme(<UserRegister />);
    await fireEvent.press(screen.getByLabelText('Selecionar data de nascimento no calendário'));
    await fireEvent(screen.getByTestId('birth-date-picker'), 'valueChange', {}, new Date(2013, 0, 5));
    await fireEvent.press(screen.getByLabelText('Confirmar data de nascimento'));
    expect(screen.getByLabelText('Data de nascimento')).toHaveDisplayValue('05/01/2013');
    expect(screen.queryByTestId('birth-date-picker')).toBeNull();
  });

  it('Mantém a data anterior quando cancela a seleção', async () => {
    await renderWithTheme(<UserRegister />);
    await fireEvent.changeText(screen.getByLabelText('Data de nascimento'), '05012013');
    await fireEvent.press(screen.getByLabelText('Selecionar data de nascimento no calendário'));
    expect(screen.getByTestId('birth-date-picker').props.value).toEqual(new Date(2013, 0, 5));
    await fireEvent(screen.getByTestId('birth-date-picker'), 'valueChange', {}, new Date(2014, 0, 5));
    await fireEvent.press(screen.getByLabelText('Cancelar seleção da data'));
    expect(screen.getByLabelText('Data de nascimento')).toHaveDisplayValue('05/01/2013');
  });
});

it('Confirma e fecha o calendário diretamente no Android', async () => {
  const { Platform } = require('react-native');
  const platform = jest.replaceProperty(Platform, 'OS', 'android');
  try {
    await renderWithTheme(<UserRegister />);
    await fireEvent.press(screen.getByLabelText('Selecionar data de nascimento no calendário'));
    await fireEvent(screen.getByTestId('birth-date-picker'), 'valueChange', {}, new Date(2013, 0, 5));
    expect(screen.getByLabelText('Data de nascimento')).toHaveDisplayValue('05/01/2013');
    expect(screen.queryByTestId('birth-date-picker')).toBeNull();
    await fireEvent.press(screen.getByLabelText('Selecionar data de nascimento no calendário'));
    await fireEvent(screen.getByTestId('birth-date-picker'), 'dismiss');
    expect(screen.getByLabelText('Data de nascimento')).toHaveDisplayValue('05/01/2013');
    expect(screen.queryByTestId('birth-date-picker')).toBeNull();
  } finally {
    platform.restore();
  }
});
