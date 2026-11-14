import { Animated } from 'react-native';
import styled from 'styled-components/native';
import { ResponsiveProps } from '@/types/Props';

export const Container = styled.ScrollView.attrs({
  keyboardShouldPersistTaps: 'handled',
  contentContainerStyle: { flexGrow: 1, justifyContent: 'center' },
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Card = styled(Animated.View)`
  width: 100%;
  max-width: 420px;
  align-self: center;
  padding: 32px 24px;
  gap: 20px;
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

export const ToastContainer = styled(Animated.View)`
  position: absolute;
  top: 56px;
  left: 24px;
  right: 24px;
  max-width: 420px;
  align-self: center;
  background-color: #fffcf2;
  border-left-width: 6px;
  border-left-color: #c0392b;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 14px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 10px;
  shadow-offset: 0px 4px;
  elevation: 6;
  z-index: 999;
`;

export const ToastContent = styled.View`
  flex: 1;
  padding-right: 12px;
  gap: 2px;
`;

export const ToastTitle = styled.Text`
  color: #8a4126;
  font-weight: 700;
  font-size: 14px;
`;

export const ToastMessage = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

export const ToastCloseText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 13px;
`;

export const LogoImage = styled.Image<ResponsiveProps>`
  width: ${({ $screenWidth }) => ($screenWidth > 500 ? 61 : 60)}px;
  height: ${({ $screenWidth }) => ($screenWidth > 500 ? 57 : 58)}px;
`;