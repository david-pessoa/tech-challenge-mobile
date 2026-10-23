import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const AppContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;
export const Scroll = styled.ScrollView`
  flex: 1;
`;
