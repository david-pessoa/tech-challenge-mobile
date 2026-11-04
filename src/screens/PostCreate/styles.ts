import { StyleSheet } from 'react-native';
import { theme } from '../../styles/Theme';

export const styles = StyleSheet.create({
  screen: { backgroundColor: '#FFFFFF' },
  content: { flexGrow: 1 },
  main: { flexGrow: 1, width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 40 },
  form: { marginTop: 48, gap: 24 },
  field: { gap: 8 },
  label: { fontFamily: theme.typography.fontFamily.semiBold, fontSize: 16, color: theme.colors.text },
  input: { minHeight: 48, borderRadius: 24, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: theme.colors.fieldBackground, fontFamily: theme.typography.fontFamily.regular, fontSize: 14, color: theme.colors.text },
  select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  selectText: { flexShrink: 1, fontFamily: theme.typography.fontFamily.regular, fontSize: 14, color: theme.colors.text },
  placeholder: { color: theme.colors.fieldPlaceholder },
  optionsOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: 'rgba(50, 67, 77, 0.3)' },
  options: { width: '100%', maxWidth: 360, maxHeight: '80%', padding: 20, gap: 12, borderRadius: 20, backgroundColor: '#FFFFFF' },
  option: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12 },
  selectedOption: { backgroundColor: theme.colors.fieldBackground },
  contentInput: { minHeight: 180 },
  title: { fontFamily: theme.typography.fontFamily.semiBold, fontSize: 20, color: theme.colors.text, textAlign: 'center' },
});
