import { ResponsiveProps } from '@/types/Props';
import styled from 'styled-components/native';

export const InputContainer = styled.Pressable<ResponsiveProps>`
  position: relative;
  background-color: #fde9a06b;
  border-radius: 20px;
  flex: 1;
  height: ${({ $screenWidth }) => ($screenWidth > 900 ? 42 : $screenWidth > 600 ? 39 : 30)}px;
  padding: ${({ $screenWidth }) => ($screenWidth > 900 ? 15 : $screenWidth > 600 ? 9 : 3)}px;
  box-sizing: border-box;
  z-index: 30;
`;

export const InnerInputContainer = styled.View<ResponsiveProps>`
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: ${({ $screenWidth }) => ($screenWidth > 600 ? 0 : 6)}px;
  padding-right: ${({ $screenWidth }) => ($screenWidth > 600 ? 0 : 6)}px;
  flex-direction: row;
  flex-shrink: 1;
`;

export const ResultsList = styled.ScrollView<ResponsiveProps>`
  position: absolute;
  width: 100%;
  padding: ${({ $screenWidth }) => ($screenWidth > 900 ? 15 : 9)}px;
  left: 0;
  top: ${({ $screenWidth }) => ($screenWidth > 900 ? '70%' : '55%')};
  box-sizing: border-box;
  z-index: 900;
  margin-top: 5px;
  height: 240px;
  flex-grow: 0;
  background-color: #fef4d0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

export const ListItemButton = styled.Pressable<ResponsiveProps>`
  margin-top: ${({ $screenWidth }) => ($screenWidth > 600 ? 10 : 0)}px;
  color: inherit;
  text-decoration: none;
  height: ${({ $screenWidth }) => ($screenWidth > 600 ? 40 : 24)}px;
  border-radius: 10px;
  padding: 2px;
`;

export const ListItem = styled.View<ResponsiveProps>`
  gap: ${({ $screenWidth }) => ($screenWidth > 600 ? 40 : 16)}px;
  flex-direction: row;
  flex: 1;
  min-width: 0;
`;

export const ListItemTitle = styled.Text<ResponsiveProps>`
  overflow: hidden;
  font-size: ${({ $screenWidth }) => ($screenWidth > 900 ? 16 : $screenWidth > 600 ? 14 : 10)}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  color: ${({ theme }) => theme.colors.text};
`;
export const ListItemDescription = styled.Text.attrs({
  numberOfLines: 1,
  ellipsizeMode: 'tail',
})<ResponsiveProps>`
  overflow: hidden;
  min-width: 0;
  flex-shrink: 1;
  font-size: ${({ $screenWidth }) => ($screenWidth > 900 ? 16 : $screenWidth > 600 ? 14 : 10)}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  color: ${({ theme }) => theme.colors.text};
`;

export const InputSearch = styled.TextInput.attrs({
  underlineColorAndroid: 'transparent',
})<ResponsiveProps>`
  background: transparent;
  font-size: ${({ $screenWidth }) => ($screenWidth > 600 ? 14 : 10)}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
  flex: 1;
  padding: 0;
  align-items: center;
`;
