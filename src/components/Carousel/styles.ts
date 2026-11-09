import styled from 'styled-components/native';
import { ResponsiveProps } from '@/types/Props';


export const Card = styled.View<ResponsiveProps>`
  height: ${({ $screenWidth }) => ($screenWidth > 900 ? 243 : 215)}px;
  width: ${({ $screenWidth }) => ($screenWidth > 900 ? 200 : $screenWidth > 600 ? 158 : 127)}px;
  border-top-right-radius: 20px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 0px;
  background: #fff6d740;
  shadow-color: #000;
  shadow-opacity: 0.8;
  shadow-radius: 2;
  elevation: 1;
`;

type BackgroundProps = {
  $backgroundColor: string;
} & ResponsiveProps;

export const IconContainer = styled.View<BackgroundProps>`
  height: ${({ $screenWidth }) => ($screenWidth > 900 ? 123 : 93)}px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  justify-content: center;
  align-items: center;
  border-top-right-radius: 20px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  gap: ${({ $screenWidth }) => ($screenWidth > 900 ? 5 : 16)}px;
`;

type ColorProps = {
  $color: string;
} & ResponsiveProps;

export const MateriaTitle = styled.Text<ColorProps>`
  font-size: ${({ $screenWidth }) => ($screenWidth > 900 ? 22 : 15)}px;
  color: ${({ $color }) => $color};
  font-family: ${({ theme }) => theme.typography.fontFamily.semiBold};
`;

export const DescriptionContainer = styled.View`
  padding-left: 6px;
  padding-top: 8px;
`;

export const DescriptionText = styled.Text<ResponsiveProps>`
  font-size: ${({ $screenWidth }) => ($screenWidth > 600 ? 14 : 10)}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  color: ${({ theme }) => theme.colors.text};
`;

export const MateriaSubTitle = styled.Text<ColorProps>`
  font-size: 12px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  color: ${({ $color }) => $color};
  margin-bottom: 10px;
`;

export const PostTitle = styled.Text<ResponsiveProps>`
  font-size: ${({ $screenWidth }) => ($screenWidth > 900 ? 16 : 14)}px;
  margin-bottom: ${({ $screenWidth }) => ($screenWidth > 900 ? 5 : 8)}px;
  display: -webkit-box;
  -webkit-line-clamp: 2;         /* Número máximo de linhas */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: ${({ theme }) => theme.typography.fontFamily.semiBold};
  color: ${({ theme }) => theme.colors.text};
`;