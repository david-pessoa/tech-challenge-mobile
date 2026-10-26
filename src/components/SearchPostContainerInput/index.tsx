import { Search } from '@material-symbols-svg/react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useDebounce } from '../../hooks/debounce';
import { searchPost } from '../../services/post.service';
import type { Post } from '../../types/Posts';
import {
  InnerInputContainer,
  InputContainer,
  InputSearch,
  ListItem,
  ListItemButton,
  ResultsList,
} from './styles';

export default function SearchPostContainerInput() {
  const [searchedPostsList, setSearchedPostsList] = useState<Post[]>([]);
  const [searchedText, setSearchedText] = useState('');
  const [hideSearchResults, setHideSearchResults] = useState(true);
  const debouncedQuery = useDebounce(searchedText, 300);
  const router = useRouter();

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
    <InputContainer onPress={() => setHideSearchResults(false)}>
      <InnerInputContainer>
        <InputSearch
          placeholder="Pesquise aqui..."
          value={searchedText}
          onChangeText={setSearchedText}
          onBlur={() => setHideSearchResults(true)}
        />
        <Search />
      </InnerInputContainer>
      {hideSearchResults && (
        <ResultsList>
          {searchedPostsList.map((post, i) => (
            <ListItemButton onPress={() => goToPost(post.postId)}>
              <ListItem key={i}>
                <Text>{post.titulo}</Text>
                <Text>{post.descricao}</Text>
              </ListItem>
            </ListItemButton>
          ))}
        </ResultsList>
      )}
    </InputContainer>
  );
}
