import { StyleSheet } from 'react-native';
import { theme } from '../../styles/Theme';

export function createStyles(width: number) {
  const tablet = width >= 600;
  const regular = theme.typography.fontFamily.regular;

  return StyleSheet.create({
    screen: { backgroundColor: '#FFFFFF' },
    keyboard: { flex: 1 },
    content: { flexGrow: 1 },
    main: {
      flexGrow: 1,
      width: tablet ? '90%' : '100%',
      maxWidth: 900,
      alignSelf: 'center',
      paddingHorizontal: tablet ? 0 : 20,
      paddingTop: tablet ? 24 : 12,
      paddingBottom: tablet ? 80 : 64,
    },
    navigation: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    backButton: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44, flexShrink: 1 },
    backText: { fontFamily: regular, fontSize: 14, color: theme.colors.backLink, flexShrink: 1 },
    cloud: { width: 44, height: 40, resizeMode: 'contain' },
    heading: { alignItems: 'center', gap: 8, marginTop: tablet ? 48 : 40, marginBottom: 20 },
    subject: { fontFamily: regular, fontSize: 16, color: '#287C6D' },
    titleRow: { position: 'relative', width: '100%', paddingHorizontal: 12 },
    title: {
      fontFamily: theme.typography.fontFamily.semiBold,
      fontSize: tablet ? 26 : 18,
      lineHeight: tablet ? 36 : 28,
      color: theme.colors.text,
      textAlign: 'center',
    },
    decoration: { position: 'absolute', width: 38, height: 34, top: -18, right: -8, resizeMode: 'contain' },
    description: { fontFamily: regular, fontSize: tablet ? 18 : 16, color: theme.colors.text, textAlign: 'center' },
    photo: { width: '100%', aspectRatio: 682 / 309, resizeMode: 'cover' },
    metadata: { gap: 8, marginTop: tablet ? 40 : 32, marginBottom: tablet ? 48 : 40 },
    authorRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFE89C', borderWidth: 3, borderColor: '#FFF3CC' },
    author: { fontFamily: regular, fontSize: 16, color: theme.colors.text, flexShrink: 1 },
    dates: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 8, rowGap: 4 },
    date: { fontFamily: regular, fontSize: 13, color: theme.colors.backLink },
    status: { minHeight: 240, alignItems: 'center', justifyContent: 'center', gap: 16 },
    statusText: { fontFamily: regular, fontSize: 14, color: theme.colors.text, textAlign: 'center' },
    retryButton: { minHeight: 44, borderRadius: 24, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: theme.colors.primary, justifyContent: 'center' },
    retryText: { fontFamily: regular, fontSize: 14, color: '#FFFFFF' },
    imageFallback: { width: '100%', aspectRatio: 682 / 309, backgroundColor: theme.colors.fieldBackground, alignItems: 'center', justifyContent: 'center' },
    body: { fontFamily: regular, fontSize: tablet ? 18 : 16, lineHeight: tablet ? 30 : 25, color: '#242424' },
  });
}
