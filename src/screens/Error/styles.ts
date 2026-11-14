import styled from 'styled-components/native';
import { ResponsiveProps } from '@/types/Props';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Card = styled.View`
  width: 100%;
  max-width: 420px;
  align-self: center;
  padding: 32px 24px;
  gap: 16px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const StatusBadge = styled.View`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: #fffcf2;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.secondary};
`;

export const StatusText = styled.Text`
  color: #c0392b;
  font-weight: 700;
  font-size: 15px;
`;

export const Subtitle = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 16px;
  margin-top: 4px;
`;

export const Title = styled.Text`
  color: #8a4126;
  font-size: 28px;
  font-weight: 700;
`;

export const MessageBox = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 16px;
  shadow-color: ${({ theme }) => theme.colors.secondary};
  shadow-opacity: 0.25;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: 2;
`;

export const Description = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  line-height: 22px;
`;

export const ButtonGroup = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 12px;
`;

export const PrimaryButton = styled.Pressable`
  flex: 1;
  align-items: center;
  padding: 12px 20px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const PrimaryButtonText = styled.Text`
  color: #fff;
  font-weight: 600;
  font-size: 16px;
`;

export const SecondaryButton = styled.Pressable`
  flex: 1;
  align-items: center;
  padding: 12px 20px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.primary};
`;

export const SecondaryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 16px;
`;

export const LogoImage = styled.Image<ResponsiveProps>`
  width: ${({ $screenWidth }) => $screenWidth > 500 ? 61 : 40}px;
  height: ${({ $screenWidth }) => $screenWidth > 500 ? 57 : 38}px;
`;