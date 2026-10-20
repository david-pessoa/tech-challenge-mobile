import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Screen } from './styles';

export default function Home() {
  return (
    <Screen edges={['top', 'right', 'bottom', 'left']}>
      <Header />
      <Footer />
    </Screen>
  );
}
