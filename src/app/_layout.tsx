import { ThemeProvider } from "styled-components/native";
import { theme } from "@/styles/theme";
import App from './index'
// import AppRoutes from './routes/AppRoutes';

import { GlobalStyles } from '../styles/GlobalStyles';
import { UserProvider } from '../context/AuthContext';

export default function Layout() {
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <UserProvider>
        <App />
      </UserProvider>
    </ThemeProvider>
  );
}
