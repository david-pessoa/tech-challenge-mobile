import { theme } from '@/styles/theme';
import { ThemeProvider } from 'styled-components/native';
import { UserProvider } from '../context/AuthContext';
import { AppContainer } from '../styles/GlobalStyles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from './routes';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <AppContainer>
          <UserProvider>
            <Routes />
          </UserProvider>
        </AppContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
