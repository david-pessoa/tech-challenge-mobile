import { ResponsiveProps } from '@/types/Props';
import styled from 'styled-components/native';

export const InputContainer = styled.Pressable<ResponsiveProps>`
  position: relative;
  background-color: #fde9a06b;
  border-radius: 20px;
  min-height: ${({ $screenWidth }) => ($screenWidth > 900 ? 42 : $screenWidth > 600 ? 39 : 21)}px;
  width: 608px;
  padding: ${({ $screenWidth }) => ($screenWidth > 900 ? 15 : $screenWidth > 600 ? 9 : 3)}px;
  box-sizing: border-box;
`;

export const InnerInputContainer = styled.View<ResponsiveProps>`
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: ${({ $screenWidth }) => ($screenWidth > 600 ? 0 : 6)}px;
  padding-right: ${({ $screenWidth }) => ($screenWidth > 600 ? 0 : 6)}px;

  /* @media (max-width: 600px) {
    min-height: 1.313rem;
  } */
`;

export const ResultsList = styled.ScrollView<ResponsiveProps>`
  position: absolute;
  width: 100%;
  padding: ${({ $screenWidth }) => ($screenWidth > 900 ? 15 : 9)}px;
  left: 0;
  top: ${({ $screenWidth }) => ($screenWidth > 900 ? '70%' : '55%')};
  box-sizing: border-box;
  z-index: 100;
  list-style: none;
  margin-top: 5px;
  max-height: 240px;
  background-color: #fef4d0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ListItemButton = styled.Pressable<ResponsiveProps>`
  margin-top: ${({ $screenWidth }) => ($screenWidth > 600 ? 10 : 0)}px;
  align-items: center;
  color: inherit;
  text-decoration: none;
  height: ${({ $screenWidth }) => ($screenWidth > 600 ? 40 : 24)}px;
  border-radius: 10px;
  padding: 2px;
`;

export const ListItem = styled.View<ResponsiveProps>`
  gap: ${({ $screenWidth }) => ($screenWidth > 600 ? 40 : 16)}px;
`;

export const ListItemText = styled.Text<ResponsiveProps>`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 240px;
  white-space: nowrap;
  font-size: ${({ $screenWidth }) => ($screenWidth > 900 ? 16 : $screenWidth > 600 ? 14 : 10)}px;
`;

export const InputSearch = styled.TextInput<ResponsiveProps>`
  border: none;
  background: transparent;
  font-size: ${({ $screenWidth }) => ($screenWidth > 600 ? 14 : 10)}px;
  width: 100%;
`;
