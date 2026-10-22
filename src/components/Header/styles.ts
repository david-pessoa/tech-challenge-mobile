import { ResponsiveProps } from '@/types/Props';
import { Role } from '@/types/Roles';
import styled from 'styled-components/native';

export const Background = styled.ImageBackground.attrs({ resizeMode: 'cover' })<{
  $role: Role;
  $screenWidth: number;
}>`
  width: 100%;
  flex-direction: row;
  margin-bottom: ${({ $screenWidth }) =>
    $screenWidth > 900 ? 70 : $screenWidth > 500 ? 28 : 16}px;

  height: ${({ $screenWidth }) => ($screenWidth > 500 ? 82 : 50)}px;
`;

const userCircleColors = {
  ADMIN: {
    backgroundColor: '#6FB2A7',
    borderColor: '#A4F3E5',
  },
  PROFESSOR: {
    backgroundColor: '#FBB3BE',
    borderColor: '#F7CED2',
  },
  ALUNO: {
    backgroundColor: '#FDE9A0',
    borderColor: '#FEF1CE',
  },
};

export const Circle = styled.Image.attrs({ resizeMode: 'cover' })<{ $role: Role, $screenWidth: number }>`
  width: ${({ $screenWidth }) => $screenWidth > 500 ? 40 : 25}px;
  height: ${({ $screenWidth }) => $screenWidth > 500 ? 40 : 25}px;
  border-radius: 20px;
  border-width: 2px;
  border-style: solid;
  border-color: ${({ $role }) => userCircleColors[$role].borderColor};
  background-color: ${({ $role }) => userCircleColors[$role].backgroundColor};
`;

export const Nav = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const LogoButton = styled.TouchableOpacity<ResponsiveProps>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  margin-left: ${({ $screenWidth }) => $screenWidth > 834 ? 100 : 16}px;
  gap: 10px;
`;

export const LogoImage = styled.Image<ResponsiveProps>`
  width: ${({ $screenWidth }) => $screenWidth > 500 ? 61 : 30}px;
  height: ${({ $screenWidth }) => $screenWidth > 500 ? 57 : 28}px;
`;

export const Title = styled.Text<ResponsiveProps>`
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ $screenWidth }) => $screenWidth > 500 ? 24 : 12}px;
`;

export const UserName = styled.Text<ResponsiveProps>`
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ $screenWidth }) => $screenWidth > 500 ? 16 : 12}px;
`;

export const LogoutContainer = styled.View<ResponsiveProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ $screenWidth }) => $screenWidth >= 600 ? 16 : 5}px;
  margin-right: ${({ $screenWidth }) => $screenWidth > 834 ? 100 : 16}px
`;

export const LogoutButton = styled.TouchableOpacity`
  background: transparent;
`;
