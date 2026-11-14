import { Stack } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { useUser } from '../context/AuthContext';
import { theme } from '../styles/Theme';

export default function Routes() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        color={theme.colors.primary}
        accessibilityLabel="Carregando sessão"
      />
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
      </Stack.Protected>

      <Stack.Protected guard={Boolean(user && ['ADMIN', 'PROFESSOR', 'ALUNO'].includes(user.role))}>
        <Stack.Screen name="home" />
        <Stack.Screen name="post/[postId]" />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(user && ['ADMIN', 'PROFESSOR'].includes(user.role))}>
        <Stack.Screen name="user-register" />
        <Stack.Screen name="post/new" />
        <Stack.Screen name="post/edit/[postId]" />
        <Stack.Screen name="user-edit/[userId]" />
        <Stack.Screen name="user-list" />
      </Stack.Protected>
    </Stack>
  );
}
