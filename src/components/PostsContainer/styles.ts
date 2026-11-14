import { ResponsiveProps } from '@/types/Props';
import styled from 'styled-components/native';

export const ContentContainer = styled.View`
  width: 100%;
  z-index: 0;
`;

export const Container = styled.View<ResponsiveProps>`
  width: 100%;
  margin-bottom: ${({ $screenWidth }) => ($screenWidth > 900 ? 58 : 35)}px;
`;

export const Title = styled.Text<ResponsiveProps>`
  margin-bottom: ${({ $screenWidth }) => ($screenWidth > 900 ? 10 : 2)}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.semiBold};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ $screenWidth }) => ($screenWidth > 600 ? 24 : 15)}px;
`;

export const AddClassButtonText = styled.Text<ResponsiveProps>`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ $screenWidth }) => ($screenWidth > 600 ? 14 : 10)}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Paragraph = styled(AddClassButtonText)`
  flex-shrink: 1;
`;

export const ParagraphMarginBottom = styled(AddClassButtonText)`
  margin-bottom: ${({ $screenWidth }) => ($screenWidth > 900 ? 30 : 25)}px;
`;

export const CenteredParagraph = styled(Paragraph)`
  text-align: center;
`;

export const AddClassContainer = styled.View<ResponsiveProps>`
  justify-content: space-between;
  flex-direction: row;
  height: 30px;
  margin-bottom: ${({ $screenWidth }) => ($screenWidth > 900 ? 29 : 16)}px;
`;

export const AddClassButton = styled.Pressable<ResponsiveProps>`
  flex-direction: row;
  height: 100%;
  width: ${({ $screenWidth }) => ($screenWidth > 600 ? 111 : 76)}px;
  border: none;
  background-color: transparent;
  align-items: center;
  justify-content: space-between;
  transition: opacity 0.2s;
  padding: 0;
`;

export const Pagination = styled.View<ResponsiveProps>`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  margin-top: ${({ $screenWidth }) => ($screenWidth > 600 ? -24 : -16)}px;
`;

export const PageLengthControl = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const PageLabel = styled.Text<ResponsiveProps>`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ $screenWidth }) => ($screenWidth >= 600 ? 14 : 12)}px;
  color: #a6a6a6;
`;

export const PageText = styled.Text<ResponsiveProps>`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ $screenWidth }) => ($screenWidth >= 600 ? 14 : 12)}px;
  color: #596a86;
`;

export const PageLengthButton = styled.Pressable`
  min-width: 48px;
  min-height: 44px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

export const PageButton = styled.Pressable<{ $disabled?: boolean }>`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
`;

export const OptionsOverlay = styled.Pressable`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background-color: rgba(50, 67, 77, 0.3);
`;

export const PageLengthOptions = styled.View`
  width: 100%;
  max-width: 280px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  gap: 8px;
`;

export const OptionsTitle = styled.Text`
  font-family: ${({ theme }) => theme.typography.fontFamily.semiBold};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

export const PageLengthOption = styled.Pressable<{ $selected?: boolean }>`
  min-height: 44px;
  justify-content: center;
  padding: 0 16px;
  border-radius: 12px;
  background-color: ${({ $selected }) => ($selected ? '#fffbeb' : 'transparent')};
`;