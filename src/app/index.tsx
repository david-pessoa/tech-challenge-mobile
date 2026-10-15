import { type ReactNode } from 'react';
import { useUser } from '../context/AuthContext';
import { Redirect, useNavigation } from 'expo-router';
import styled from 'styled-components/native';
import type { Role } from '../types/Roles';

const LoadingWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; 
  width: 100%;
  background-color: #FFFCF7;
`;

const Spinner = styled.View`
  width: 60px;
  height: 60px;
  border: 6px solid #F6D4D9;
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.Text`
  margin-top: 16px;
  font-size: 1.2rem;
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
        <Spinner />
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


