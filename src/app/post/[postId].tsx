import { useLocalSearchParams } from 'expo-router';
import PostScreen from '../../screens/Post';

export default function PostRoute() {
  const { postId } = useLocalSearchParams<{ postId: string }>();

  return <PostScreen postId={postId} />;
}