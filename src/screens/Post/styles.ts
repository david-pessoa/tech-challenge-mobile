import { StyleSheet } from 'react-native';
import { theme } from '../../styles/Theme';

export function createStyles(width: number) {
  const tablet = width >= 600;

  return StyleSheet.create({
    screen: { backgroundColor: '#FFFFFF' },
    content: { flexGrow: 1 },
    main: {
      flexGrow: 1,
      minHeight: 320,
      width: tablet ? '90%' : '100%',
      maxWidth: 900,
      alignSelf: 'center',
      paddingHorizontal: tablet ? 0 : 20,
      paddingTop: tablet ? 32 : 24,
      paddingBottom: tablet ? 64 : 48,
    },
    title: {
      fontFamily: theme.typography.fontFamily.semiBold,
      fontSize: tablet ? 26 : 20,
      color: theme.colors.text,
      textAlign: 'center',
    },
  });
}
