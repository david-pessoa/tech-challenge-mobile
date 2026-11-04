import { StyleSheet } from 'react-native';
import { theme } from '../../styles/Theme';

export const styles = StyleSheet.create({
  screen: { backgroundColor: '#FFFFFF' },
  content: { flexGrow: 1 },
  main: { flexGrow: 1, width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 40 },
  title: { fontFamily: theme.typography.fontFamily.semiBold, fontSize: 20, color: theme.colors.text, textAlign: 'center' },
});
