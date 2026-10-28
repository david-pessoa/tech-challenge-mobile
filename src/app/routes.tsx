import { useUser } from '../context/AuthContext';
import { Stack } from 'expo-router';

export default function Routes() {
  const { user } = useUser();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
      </Stack.Protected>

      <Stack.Protected
        guard={Boolean(
          user &&
          ['ADMIN', 'PROFESSOR', 'ALUNO'].includes(user.role)
        )}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="post/[postId]" />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(user && ['ADMIN', 'PROFESSOR'].includes(user.role))}>
        <Stack.Screen name="user-register" />
        <Stack.Screen name="post/new" />
      </Stack.Protected>
    </Stack>
  );
}