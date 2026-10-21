import { Link } from "expo-router";
import { useUser } from "../../context/AuthContext";
import { HomeView, MainText } from "./styles";

export default function Home() {
  const { user, isLoading } = useUser();
  return (
    <HomeView>
      <MainText>Olá mundo</MainText>
      {!isLoading && user && ['ADMIN', 'PROFESSOR'].includes(user.role) && (
        <Link href="/user-register">Cadastrar usuário</Link>
      )}
    </HomeView>
  );
}