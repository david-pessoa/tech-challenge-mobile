import { Link } from "expo-router";
import { HomeView, MainText } from "./styles";

export default function Home() {
  return (
    <HomeView>
      <MainText>Olá mundo</MainText>
      <Link href="/user-register">Cadastrar usuário</Link>
    </HomeView>
  );
}