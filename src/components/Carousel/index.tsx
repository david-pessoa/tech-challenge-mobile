import { Post } from '@/types/Posts';
import { useRouter } from 'expo-router';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import CarouselCard from './CarouselCard';

type CarouselProps = {
  newPosts: Post[];
};

export default function Carousel({ newPosts }: CarouselProps) {
  const { width } = useWindowDimensions();
  const router = useRouter();

  function goToPost(id: string) {
    router.push({ pathname: '/post/[postId]', params: { postId: id } });
  }

  return (
    <SwiperFlatList
      index={0}
      data={newPosts}
      renderItem={({ item }) => (
        <View
          style={{
            width: width > 900 ? 200 : width < 600 ? 127 : 158,
            marginRight: 12,
          }}
        >
          <Pressable onPress={() => goToPost(item.id)}>
            <CarouselCard dado={item} />
          </Pressable>
        </View>
      )}
    />
  );
}
