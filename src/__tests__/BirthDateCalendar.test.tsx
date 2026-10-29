import { fireEvent, render, screen } from '@testing-library/react-native';
import BirthDateCalendar from '../components/BirthDateCalendar/index.web';

jest.mock('@material-symbols-svg/react-native', () => {
  const Icon = () => null;
  return { CalendarMonth: Icon, ChevronLeft: Icon, ChevronRight: Icon };
}, { virtual: true });

it('Seleciona o ano e confirma uma data válida em fevereiro bissexto', async () => {
  const onChange = jest.fn();
  await render(<BirthDateCalendar value="05/01/2013" onChange={onChange} />);
  await fireEvent.press(screen.getByLabelText('Selecionar data de nascimento no calendário'));
  await fireEvent.press(screen.getByLabelText('Selecionar ano'));
  await fireEvent.press(screen.getByLabelText('Ano 2012'));
  await fireEvent.press(screen.getByLabelText('Próximo mês'));
  await fireEvent.press(screen.getByLabelText('29/02/2012'));
  await fireEvent.press(screen.getByLabelText('Confirmar data de nascimento'));
  expect(onChange).toHaveBeenCalledWith('29/02/2012');
  expect(screen.queryByLabelText('Confirmar data de nascimento')).toBeNull();
});

it('Mantém a data ao cancelar a seleção no calendário web', async () => {
  const onChange = jest.fn();
  await render(<BirthDateCalendar value="05/01/2013" onChange={onChange} />);
  await fireEvent.press(screen.getByLabelText('Selecionar data de nascimento no calendário'));
  await fireEvent.press(screen.getByLabelText('06/01/2013'));
  await fireEvent.press(screen.getByLabelText('Cancelar seleção da data'));
  expect(onChange).not.toHaveBeenCalled();
});

it('Bloqueia a escolha de uma data futura', async () => {
  jest.useFakeTimers().setSystemTime(new Date(2026, 9, 29, 12));
  try {
    await render(<BirthDateCalendar value="29/10/2026" onChange={jest.fn()} />);
    await fireEvent.press(screen.getByLabelText('Selecionar data de nascimento no calendário'));
    expect(screen.getByLabelText('30/10/2026')).toBeDisabled();
    expect(screen.getByLabelText('Próximo mês')).toBeDisabled();
  } finally {
    jest.useRealTimers();
  }
});
