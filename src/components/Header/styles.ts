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
  width: ${({ $screenWidth }) => $screenWidth > 500 ? 31 : 25}px;
  height: ${({ $screenWidth }) => $screenWidth > 500 ? 31 : 25}px;
  border-radius: 16px;
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

export const LogoButton = styled.TouchableOpacity<{$screenWidth: number}>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  margin-left: ${({ $screenWidth }) => $screenWidth > 834 ? 100 : 20}px;
  gap: 10px;
`;

export const LogoImage = styled.Image<{$screenWidth:number}>`
  width: ${({ $screenWidth }) => $screenWidth > 500 ? 61 : 30}px;
  height: ${({ $screenWidth }) => $screenWidth > 500 ? 57 : 28}px;
`;

export const Title = styled.Text<{$screenWidth:number}>`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  font-size: ${({ $screenWidth }) => $screenWidth > 500 ? 24 : 14}px;
`;

export const UserName = styled.Text<{$screenWidth:number}>`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  font-size: ${({ $screenWidth }) => $screenWidth > 500 ? 16 : 14}px;
`;

export const LogoutContainer = styled.View<{$screenWidth:number}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-right: ${({ $screenWidth }) => $screenWidth > 834 ? 100 : 18}px
`;

export const LogoutButton = styled.TouchableOpacity`
  background: transparent;
`;
