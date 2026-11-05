import { Platform, StyleSheet } from 'react-native';
import { theme } from '../../styles/Theme';

export function createStyles(width: number) {
  const tablet = width >= 600;

  return StyleSheet.create({
    screen: { backgroundColor: '#FFFFFF' },
    content: { flexGrow: 1 },
    main: { flexGrow: 1, width: tablet ? '90%' : '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: tablet ? 0 : 20, paddingTop: tablet ? 64 : 72, paddingBottom: tablet ? 64 : 48 },
    titleRow: { alignSelf: 'center', position: 'relative', marginBottom: tablet ? 56 : 64 },
    title: { fontFamily: theme.typography.fontFamily.semiBold, fontSize: tablet ? 26 : 20, color: theme.colors.text },
    decoration: { position: 'absolute', width: 44, height: 39, top: -16, right: -26 },
    form: { gap: tablet ? 32 : 36 },
    field: { gap: 8 },
    photoContainer: { position: 'relative' },
    photoPicker: { height: tablet ? 220 : 129, width: '100%', borderRadius: 15, backgroundColor: 'rgba(235, 220, 220, 0.24)', alignItems: 'center', justifyContent: 'center', gap: 15, overflow: 'hidden' },
    photoBorder: { position: 'absolute', top: 0, left: 0 },
    photoHint: { fontFamily: theme.typography.fontFamily.semiBold, fontSize: 12, lineHeight: 30, textAlign: 'center', color: '#7A3131' },
    photoPreview: { width: '100%', height: '100%' },
    removePhotoButton: { position: 'absolute', top: -16, left: -16, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
    removePhotoIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#F9CBD3', alignItems: 'center', justifyContent: 'center' },
    photoError: { fontFamily: theme.typography.fontFamily.regular, fontSize: 12, color: '#A52A36', paddingHorizontal: 12 },
    label: { fontFamily: theme.typography.fontFamily.semiBold, fontSize: 16, color: theme.colors.text },
    input: {
      ...Platform.select({ web: { outlineWidth: 0, outlineStyle: 'solid', outlineColor: 'transparent' } }),
      minHeight: 48,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: 'transparent',
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: '#FAF8F0',
      boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.13)',
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: 14,
      color: theme.colors.text,
    },
    inputFocused: { borderColor: theme.colors.fieldFocus },
    select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    selectText: { flexShrink: 1, fontFamily: theme.typography.fontFamily.medium, fontSize: 14, color: theme.colors.text },
    placeholder: { color: theme.colors.fieldPlaceholder },
    contentInput: { minHeight: tablet ? 240 : 180, borderRadius: 28, paddingTop: 20 },
    actions: { flexDirection: 'row', justifyContent: tablet ? 'flex-end' : 'center', marginTop: 40 },
    submitButton: { minWidth: 128, minHeight: 44, borderRadius: 24, paddingHorizontal: 28, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary },
    submitText: { fontFamily: theme.typography.fontFamily.regular, fontSize: 16, color: '#FFFFFF' },
    optionsOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: 'rgba(50, 67, 77, 0.3)' },
    options: { width: '100%', maxWidth: 360, maxHeight: '80%', padding: 20, gap: 12, borderRadius: 20, backgroundColor: '#FFFFFF' },
    option: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12 },
    selectedOption: { backgroundColor: theme.colors.fieldBackground },
  });
}
