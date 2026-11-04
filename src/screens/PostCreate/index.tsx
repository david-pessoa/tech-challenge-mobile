import { Text, View } from 'react-native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Screen, Scroll } from '../../styles/GlobalStyles';
import { styles } from './styles';

export default function PostCreate() {
  return (
    <Screen style={styles.screen} edges={['top', 'right', 'bottom', 'left']}>
      <Scroll contentContainerStyle={styles.content}>
        <Header />
        <View style={styles.main}>
          <Text style={styles.title} accessibilityRole="header">Nova aula</Text>
        </View>
        <Footer />
      </Scroll>
    </Screen>
  );
}
