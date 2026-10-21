import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { position: 'absolute', left: 16, right: 16, alignItems: 'center', zIndex: 10, elevation: 10 },
  toast: { width: '100%', maxWidth: 480, borderRadius: 12, paddingLeft: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.18)' },
  success: { backgroundColor: '#287453' },
  error: { backgroundColor: '#A52A36' },
  message: { flex: 1, fontFamily: 'Poppins', fontSize: 12, lineHeight: 18, color: '#FFFFFF' },
  closeButton: { width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 24, color: '#FFFFFF' },
});
