import { theme } from '@/styles/theme';
import { ThemeProvider } from 'styled-components/native';
import { UserProvider } from '../context/AuthContext';
import { AppContainer } from '../styles/GlobalStyles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from './routes';

import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

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
