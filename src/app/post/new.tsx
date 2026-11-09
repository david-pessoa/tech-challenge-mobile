import { useLocalSearchParams } from 'expo-router';
import PostFormScreen from '../../screens/PostForm';

export default function PostFormRoute() {
  const { postId } = useLocalSearchParams<{ postId: string }>();

  return <PostFormScreen postId={postId} />;
}
