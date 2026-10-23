import { ThemeProvider } from 'styled-components/native';
import { theme } from '@/styles/Theme';
import Index from './index';
import Routes from './routes'
import { AppContainer } from '../styles/GlobalStyles';
import { UserProvider} from '../context/AuthContext';


export default function Layout() {
  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <UserProvider>
          <Routes />
        </UserProvider>
      </AppContainer>
    </ThemeProvider>
  );
}
