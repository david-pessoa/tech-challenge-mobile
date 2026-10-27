import { Search } from '@material-symbols-svg/react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useDebounce } from '../../hooks/debounce';
import { searchPost } from '../../services/post.service';
import type { Post } from '../../types/Posts';
import {
  InnerInputContainer,
  InputContainer,
  InputSearch,
  ListItem,
  ListItemButton,
  ListItemText,
  ResultsList,
} from './styles';

export default function SearchPostContainerInput() {
  const [searchedPostsList, setSearchedPostsList] = useState<Post[]>([]);
  const [searchedText, setSearchedText] = useState('');
  const [hideSearchResults, setHideSearchResults] = useState(true);
  const debouncedQuery = useDebounce(searchedText, 300);
  const router = useRouter();
  const { width } = useWindowDimensions();

  async function handleInputChange() {
    if (searchedText === '') {
      setSearchedPostsList([]);
      return;
    }
    try {
      const relatedPosts = await searchPost(searchedText);
      setSearchedPostsList(relatedPosts.slice(0, 10));
    } catch (error) {
      setSearchedPostsList([]);
    }
  }

  useEffect(() => {
    if (debouncedQuery) {
      handleInputChange();
    }
  }, [debouncedQuery]);

  function goToPost(postId: string) {
    router.replace({
      pathname: '/post/[postId]',
      params: { postId },
    });
  }

  return (
    <InputContainer $screenWidth={width} onPress={() => setHideSearchResults(false)}>
      <InnerInputContainer $screenWidth={width}>
        <InputSearch
          $screenWidth={width}
          placeholder="Pesquise aqui..."
          value={searchedText}
          onChangeText={setSearchedText}
          onBlur={() => setHideSearchResults(true)}
        />
        <Search height={16} width={16} />
      </InnerInputContainer>
      {hideSearchResults && (
        <ResultsList $screenWidth={width}>
          {searchedPostsList.map((post, i) => (
            <ListItemButton
              $screenWidth={width}
              onPress={() => goToPost(post.postId)}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#6f674c6b' : '#fef4d0',
              })}
            >
              <ListItem key={i} $screenWidth={width}>
                <ListItemText $screenWidth={width}>{post.titulo}</ListItemText>
                <ListItemText $screenWidth={width}>{post.descricao}</ListItemText>
              </ListItem>
            </ListItemButton>
          ))}
        </ResultsList>
      )}
    </InputContainer>
  );
}
