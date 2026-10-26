import { useUser } from '../../context/AuthContext';
import { HomeView, LogoutButton, LogoutText, MainText } from './styles';

/**
 * Home provisória: mostra o nome do usuário logado e um botão "Sair".
 * Serve pra validar o fluxo de autenticação (login -> home -> logout).
 */
export default function Home() {
  const { user, signOut } = useUser();

  return (
    <HomeView>
      <MainText>Olá, {user?.nome}</MainText>
      {/* Ao deslogar, user vira undefined e o <Stack.Protected> volta pra /login */}
      <LogoutButton onPress={signOut}>
        <LogoutText>Sair</LogoutText>
      </LogoutButton>
    </HomeView>
  );
}
