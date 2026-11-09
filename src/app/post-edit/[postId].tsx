import { useLocalSearchParams } from 'expo-router';
import PostCreate from '../../screens/PostCreate';

export default function PostEdit() {
  const { postId } = useLocalSearchParams<{ postId: string }>();

  return <PostCreate key={postId} postId={postId} />;
}
