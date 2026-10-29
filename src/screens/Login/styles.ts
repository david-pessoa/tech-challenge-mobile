import styled from 'styled-components/native';

/**
 * Estilos da tela de Login (mobile).
 * No React Native não existem "rem" nem CSS global: os valores são em
 * números/px e cada componente é estilizado individualmente.
 */

// Rola o conteúdo quando o teclado ocupa a tela; centraliza o card na vertical.
export const Container = styled.ScrollView.attrs({
  keyboardShouldPersistTaps: 'handled',
  contentContainerStyle: { flexGrow: 1, justifyContent: 'center' },
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Card = styled.View`
  width: 100%;
  max-width: 420px;
  align-self: center;
  padding: 32px 24px;
  gap: 20px;
`;

// Selo "Fy" com a cor primária (no RN não há linear-gradient nativo sem biblioteca)
export const LogoBadge = styled.View`
  width: 52px;
  height: 52px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const LogoText = styled.Text`
  color: #fffcf2;
  font-weight: 600;
  font-size: 18px;
`;

export const Greeting = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 16px;
`;

export const Title = styled.Text`
  color: #8a4126;
  font-size: 30px;
  font-weight: 700;
`;

export const FieldGroup = styled.View`
  gap: 6px;
`;

export const Label = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
`;

// Caixa do campo: borda, fundo e sombra suave na cor secundária
export const InputBox = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 0 12px;
  shadow-color: ${({ theme }) => theme.colors.secondary};
  shadow-opacity: 0.35;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: 2;
`;

export const Input = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.fieldPlaceholder,
}))`
  flex: 1;
  padding: 12px 0;
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text};
`;

export const ToggleText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
  padding-left: 8px;
`;

export const ErrorMessage = styled.Text`
  color: #c0392b;
  font-size: 15px;
`;

export const LoginButton = styled.Pressable<{ $disabled?: boolean }>`
  align-self: center;
  margin-top: 8px;
  padding: 12px 36px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.secondary};
  opacity: ${({ $disabled }) => ($disabled ? 0.7 : 1)};
`;

export const LoginButtonText = styled.Text`
  color: #fff;
  font-weight: 600;
  font-size: 17px;
`;
