import styled from 'styled-components/native';
import { View } from 'react-native';

const MainText = styled.Text`
  font-size: 24px;
  color: black;
  font-family: Arial;
  text-align: center;
`;

const HomeView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default function HomeScreen() {
  return (
    <HomeView>
      <MainText>Olá mundo</MainText>
    </HomeView>
  );
}


