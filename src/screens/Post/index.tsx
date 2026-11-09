import { Text, View, useWindowDimensions } from 'react-native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Screen, Scroll } from '../../styles/GlobalStyles';
import { createStyles } from './styles';

type Props = {
  postId: string;
};

export default function Post({ postId }: Props) {
  const { width } = useWindowDimensions();
  const styles = createStyles(width);

  return (
    <Screen edges={['top', 'right', 'bottom', 'left']} style={styles.screen}>
      <Scroll contentContainerStyle={styles.content}>
        <Header />
        <View key={postId} style={styles.main}>
          <Text accessibilityRole="header" style={styles.title}>Aula</Text>
        </View>
        <Footer />
      </Scroll>
    </Screen>
  );
}
