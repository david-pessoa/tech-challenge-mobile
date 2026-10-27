import { StyleSheet } from 'react-native';
import { theme } from '../../styles/Theme';

export function createStyles(width: number) {
  const tablet = width >= 600;

  return StyleSheet.create({
    screen: { backgroundColor: '#FFFFFF' },
    content: { flexGrow: 1 },
    main: { width: tablet ? '90%' : '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: tablet ? 0 : 20, paddingTop: tablet ? 56 : 40, paddingBottom: 24 },
    title: { fontFamily: theme.typography.fontFamily.semiBold, fontSize: tablet ? 28 : 16, color: theme.colors.text },
    navigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', columnGap: 12, marginBottom: tablet ? 48 : 36 },
    link: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
    linkText: { fontFamily: theme.typography.fontFamily.regular, fontSize: tablet ? 15 : 10, color: theme.colors.backLink },
    section: { marginBottom: tablet ? 48 : 36 },
    sectionTitle: { fontFamily: theme.typography.fontFamily.semiBold, fontSize: tablet ? 26 : 21, color: theme.colors.text, marginBottom: 12 },
    tableHeader: { flexDirection: 'row', alignItems: 'center', minHeight: tablet ? 76 : 64, paddingHorizontal: 4, backgroundColor: '#EFA488' },
    headerText: { fontFamily: theme.typography.fontFamily.medium, fontSize: tablet ? 14 : 10, lineHeight: tablet ? 21 : 15, color: '#FFFCF2', textAlign: 'center' },
    row: { flexDirection: 'row', alignItems: 'center', minHeight: tablet ? 80 : 68, paddingHorizontal: 4, paddingVertical: 10, backgroundColor: '#FFFBEB' },
    column: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
    photoColumn: { flex: 0.75 },
    nameColumn: { flex: 1.4 },
    dateColumn: { flex: 1.35 },
    actionsColumn: { flex: 0.8 },
    cellText: { fontFamily: theme.typography.fontFamily.semiBold, fontSize: tablet ? 13 : 10, lineHeight: tablet ? 20 : 15, color: theme.colors.text, textAlign: 'center' },
    photo: { width: tablet ? 48 : 34, height: tablet ? 48 : 34, borderRadius: tablet ? 24 : 17 },
    status: { padding: 24, alignItems: 'center', gap: 12, backgroundColor: '#FFFBEB' },
    statusText: { fontFamily: theme.typography.fontFamily.regular, fontSize: 13, color: theme.colors.text, textAlign: 'center' },
    errorText: { color: '#A52A36' },
    retryButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: theme.colors.primary, borderRadius: 22 },
    retryText: { fontFamily: theme.typography.fontFamily.medium, color: theme.colors.primary, fontSize: 13 },
    pagination: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 8 },
    pageText: { fontFamily: theme.typography.fontFamily.regular, fontSize: tablet ? 14 : 12, color: '#596A86' },
    pageButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    disabled: { opacity: 0.35 },
  });
}
