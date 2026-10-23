import { StyleSheet } from 'react-native';
import { theme } from '../styles/Theme';

export const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 480, alignSelf: 'center', padding: 16, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 1, borderColor: '#ECE4C9', backgroundColor: '#FFF8DE' },
  card: { padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#D9D0AE', backgroundColor: '#FFF8DE', boxShadow: '0px 2px 5px rgba(78, 68, 30, 0.25)', gap: 18 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  logo: { width: 47, height: 44 },
  name: { fontFamily: 'PoppinsMedium', fontSize: 26, color: theme.colors.text },
  text: { fontFamily: 'Poppins', fontSize: 10, lineHeight: 15, color: theme.colors.text },
  links: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  linkText: { width: '46%', fontFamily: 'Poppins', fontSize: 10, color: theme.colors.text, textDecorationLine: 'underline' },
  bottom: { borderTopWidth: 1, borderTopColor: '#CFC5A4', paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  column: { width: '46%' },
});
