import styled from 'styled-components/native';
import { View } from 'react-native';

const MainText = styled.Text`
  font-size: 24px;
  color: black;
  font-family: Arial;
`;

export default function HomeScreen() {
  return (
    <View>
      <MainText>Olá mundo</MainText>
    </View>
  );
}


