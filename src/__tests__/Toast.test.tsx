import { act, fireEvent, render, screen } from '@testing-library/react-native';
import Toast from '../components/Toast';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock(
  '@material-symbols-svg/react-native',
  () => ({
    Close: () => null,
  }),
  { virtual: true },
);

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

it('Fecha a notificação automaticamente após cinco segundos', async () => {
  const onClose = jest.fn();
  await render(<Toast message="Usuário cadastrado com sucesso!" type="success" onClose={onClose} />);
  expect(screen.getByRole('alert')).toHaveTextContent('Usuário cadastrado com sucesso!');
  await act(async () => jest.advanceTimersByTime(4999));
  expect(onClose).not.toHaveBeenCalled();
  await act(async () => jest.advanceTimersByTime(1));
  expect(onClose).toHaveBeenCalledTimes(1);
});

it('Permite fechar uma notificação de erro pelo botão', async () => {
  const onClose = jest.fn();
  await render(<Toast message="Não foi possível cadastrar o usuário." type="error" onClose={onClose} />);
  await fireEvent.press(screen.getByLabelText('Fechar notificação'));
  expect(onClose).toHaveBeenCalledTimes(1);
});

it('Cancela o fechamento automático ao desmontar a notificação', async () => {
  const onClose = jest.fn();
  const { unmount } = await render(<Toast message="Cadastro concluído" type="success" onClose={onClose} />);
  await unmount();
  await act(async () => jest.advanceTimersByTime(5000));
  expect(onClose).not.toHaveBeenCalled();
});
