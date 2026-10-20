import { type ReactNode } from 'react';
import { useUser } from '../context/AuthContext';
import { Redirect, useNavigation } from 'expo-router';
import styled from 'styled-components/native';
import type { Role } from '../types/Roles';
import { ActivityIndicator } from 'react-native';

const LoadingWrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1; 
  width: 100%;
  background-color: #FFFCF7;
`;

const Spinner = styled.View`
  width: 60px;
  height: 60px;
  border-width: 6px;
  border-style: solid;
  border-color: #f6d4d9;
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 30px;
  /* animation: spin 1s linear infinite; */

  /* @keyframes spin {
    to { transform: rotate(360deg); }
  } */
`;

const LoadingText = styled.Text`
  margin-top: 16px;
  font-size: 19px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

type PrivateRoutesProps = {
  children: ReactNode;
  acceptedRoles: Role[];
};

export default function Index({ children, acceptedRoles }: PrivateRoutesProps) {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <LoadingWrapper>
        <ActivityIndicator size="large" color="#C0765A"/>
        <LoadingText>Verificando acessos...</LoadingText>
      </LoadingWrapper>
    );
  }
  if (!user) {
    return <Redirect href='/login' />;
  }
  if (!acceptedRoles.includes(user.role)) {
    // Tela de acesso não autorizado
  }
  return <>{children}</>;
}


