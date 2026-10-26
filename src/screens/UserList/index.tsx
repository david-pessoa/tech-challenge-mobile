import { Text, View } from 'react-native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Screen, Scroll } from '../../styles/GlobalStyles';

export default function UserList() {
  return (
    <Screen edges={['top', 'right', 'bottom', 'left']}>
      <Scroll>
        <Header />
        <View>
          <Text accessibilityRole="header">Lista completa</Text>
        </View>
        <Footer />
      </Scroll>
    </Screen>
  );
}
