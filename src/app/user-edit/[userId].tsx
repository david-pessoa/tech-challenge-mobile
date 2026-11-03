import { useLocalSearchParams } from 'expo-router';
import UserRegister from '../../screens/UserRegister';

export default function UserEdit() {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  return <UserRegister key={userId} userId={userId} />;
}
