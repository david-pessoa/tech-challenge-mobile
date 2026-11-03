import { StyleSheet } from 'react-native';
import { theme } from '../../styles/Theme';

export const styles = StyleSheet.create({
  calendarDialog: { maxWidth: 360, maxHeight: '90%' },
  monthNavigation: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  monthButton: { width: 36, height: 44, alignItems: 'center', justifyContent: 'center' },
  monthTitle: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  calendarText: { fontFamily: theme.typography.fontFamily.medium, color: theme.colors.text, fontSize: 12 },
  weekRow: { flexDirection: 'row' },
  weekday: { flex: 1, textAlign: 'center', fontFamily: theme.typography.fontFamily.medium, color: theme.colors.uploadText, fontSize: 12, paddingVertical: 8 },
  day: { flex: 1, minHeight: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  selectedDay: { backgroundColor: theme.colors.primary },
  selectedDayText: { color: '#FFFFFF' },
  disabled: { opacity: 0.35 },
  yearScroll: { maxHeight: 240 },
  yearGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  yearButton: { width: '25%', minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  button: { width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  overlay: { flex: 1, backgroundColor: 'rgba(50, 67, 77, 0.3)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  dialog: { width: '100%', maxWidth: 400, padding: 20, borderRadius: 20, backgroundColor: '#FFFFFF' },
  title: { fontFamily: theme.typography.fontFamily.semiBold, color: theme.colors.text, fontSize: 16 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16 },
  action: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  actionText: { fontFamily: theme.typography.fontFamily.medium, color: theme.colors.primary, fontSize: 14 },
});
