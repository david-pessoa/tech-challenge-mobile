import { Post } from '@/types/Posts';
import { View } from 'react-native';

type CarouselProps = {
  newPosts: Post[];
  isAdmin: boolean;
};

export default function Carousel({ newPosts, isAdmin }: CarouselProps) {
  return <View></View>;
}
