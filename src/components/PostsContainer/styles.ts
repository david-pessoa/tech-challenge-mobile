import { ResponsiveProps } from '@/types/Props';
import styled from 'styled-components/native';

export const ContentContainer = styled.View`
  flex: 1;
`;

export const Container = styled.View<ResponsiveProps>`
  width: 100%;
  margin-bottom: ${({ $screenWidth }) => ($screenWidth > 900 ? 58 : 35)}px;
`;

export const Title = styled.Text<ResponsiveProps>`
  margin-bottom: ${({ $screenWidth }) => ($screenWidth > 900 ? 10 : 2)}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ $screenWidth }) => ($screenWidth > 600 ? 24 : 15)}px;
`;

export const AddClassButtonText = styled.Text<ResponsiveProps>`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ $screenWidth }) => ($screenWidth > 600 ? 14 : 10)}px;
`;
export const Paragraph = styled(AddClassButtonText)`
  margin-bottom: ${({ $screenWidth }) => ($screenWidth > 900 ? 30 : 25)}px;
`;

export const CenteredParagraph = styled(Paragraph)`
  text-align: center;
`;

export const AddClassContainer = styled.View<ResponsiveProps>`
  justify-content: space-between;
  height: 30px;
  margin-bottom: ${({ $screenWidth }) => ($screenWidth > 900 ? 29 : 16)}px;
`;

export const AddClassButton = styled.Pressable<ResponsiveProps>`
  height: 100%;
  width: ${({ $screenWidth }) => ($screenWidth > 600 ? 111 : 76)}px;
  border: none;
  background-color: transparent;
  align-items: center;
  justify-content: space-between;
  transition: opacity 0.2s;
  padding: 0;
`;
