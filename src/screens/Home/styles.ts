import { ResponsiveProps } from '@/types/Props';
import styled from 'styled-components/native';

export const Main = styled.View<ResponsiveProps>`
  margin-left: 18px;
  flex-direction: column;
  justify-content: ${({ $screenWidth }) => ($screenWidth > 854 ? 'space-between' : 'flex-start')};
  gap: 18px;
  margin-right: 18px;
`;

export const MainContentContainer = styled.View<ResponsiveProps>`
  width: 100%;
`;

export const TopContainer = styled.View<ResponsiveProps>`
  z-index: 0;
  flex-direction: row;
  gap: ${({ $screenWidth }) => ($screenWidth > 1000 ? 36 : 0)}px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ $screenWidth }) => ($screenWidth > 600 ? 34 : 18)}px;
  justify-content: ${({ $screenWidth }) => ($screenWidth > 600 ? 'space-between' : 'flex-start')};
  width: 100%;
`;

export const Title = styled.Text<ResponsiveProps>`
  font-family: ${({ theme }) => theme.typography.fontFamily.semiBold};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ $screenWidth }) => ($screenWidth > 1000 ? 32 : $screenWidth > 600 ? 24 : 15)}px;
`;

export const Paragraph = styled.Text<ResponsiveProps>`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ $screenWidth }) => ($screenWidth > 1000 ? 16 : $screenWidth > 600 ? 14 : 10)}px;
`;

export const TitleContainer = styled.View<ResponsiveProps>`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  min-width: ${({ $screenWidth }) => ($screenWidth > 900 ? 250 : $screenWidth > 600 ? 192 : 123)}px;
`;

export const SparkleImage = styled.Image<ResponsiveProps>`
  height: ${({ $screenWidth }) => ($screenWidth > 900 ? 66 : $screenWidth > 600 ? 42 : 23)}px;
  width: ${({ $screenWidth }) => ($screenWidth > 900 ? 66 : $screenWidth > 600 ? 42 : 23)}px;
`;

export const FigureContainer = styled.View`
  flex-shrink: 1;
  min-width: 0;
`;

export const ProfileContainer = styled.View<ResponsiveProps>`
  
`;

export const ProfileImageContainer = styled.View`
  align-items: center;
  position: relative;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
`;

export const DoodleImage = styled.Image<ResponsiveProps>`
  width: ${({ $screenWidth }) => ($screenWidth > 600 ? 84.28 : 45)}px;
  height: ${({ $screenWidth }) => ($screenWidth > 600 ? 84.28 * 82/98 : 45 * 82/98)}px;
  position: absolute;
  top: ${({ $screenWidth }) => ($screenWidth > 900 ? -15 : $screenWidth > 600 ? -35 : -20)}px;
  left: ${({ $screenWidth }) => ($screenWidth > 900 ? 67 : $screenWidth > 600 ? 85 : 45)}px;
  z-index: 1;
`;

export const ProfileImage = styled.Image<ResponsiveProps>`
  position: relative;
  border-radius: ${({ $screenWidth }) => ($screenWidth > 900 ? 70 : $screenWidth > 600 ? 61 : 45)}px;
  width: ${({ $screenWidth }) => ($screenWidth > 900 ? 140 : $screenWidth > 600 ? 162 : 90)}px;
  height: ${({ $screenWidth }) => ($screenWidth > 900 ? 140 : $screenWidth > 600 ? 162 : 90)}px;
  margin-top: ${({ $screenWidth }) => ($screenWidth > 900 ? 20 : 0)}px;
`;

export const StudentName = styled.Text<ResponsiveProps>`
  font-size: ${({ $screenWidth }) => ($screenWidth > 600 ? 20 : 11)}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  color: ${({ theme }) => theme.colors.text};
`;

export const Figcaption = styled.View`
  align-items: center;
  margin-top: 12px;
  gap: 5px;
`;

export const Figure = styled.View`
  
`;
