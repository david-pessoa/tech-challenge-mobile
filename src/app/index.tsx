import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useUser } from '../context/AuthContext';

export default function Index() {
  const { user, isLoading } = useUser();
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          accessibilityLabel="Carregando sessão"
        />
        <Text
          style={[
            styles.message,
            { color: theme.colors.primary, fontFamily: theme.typography.fontFamily },
          ]}
        >
          Verificando acessos...
        </Text>
      </View>
    );
  }

  return <Redirect href={user ? '/home' : '/login'} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 19,
    fontWeight: '600',
  },
});
