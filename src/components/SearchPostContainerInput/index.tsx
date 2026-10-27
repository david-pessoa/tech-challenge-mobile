import { Search } from '@material-symbols-svg/react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useWindowDimensions, Text } from 'react-native';
import { useDebounce } from '../../hooks/debounce';
import type { Post } from '../../types/Posts';
import {
  InnerInputContainer,
  InputContainer,
  InputSearch,
  ListItem,
  ListItemButton,
  ListItemDescription,
  ListItemTitle,
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
    console.log(searchedText)
    if (searchedText === '') {
      setSearchedPostsList([]);
      return;
    }
    try {
      // const relatedPosts = await searchPost(searchedText);
      const relatedPosts = [
        {
          postId: '1',
          titulo: 'Teste1',
          descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
          materia: 'Matemática',
          autor: 'Victor Hugo',
          createdAt: new Date('2026-01-01'),
          editedAt: new Date('2026-01-01')
        },
        {
          postId: '2',
          titulo: 'Teste1',
          descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
          materia: 'Matemática',
          autor: 'Victor Hugo',
          createdAt: new Date('2026-01-01'),
          editedAt: new Date('2026-01-01')
        },
        {
          postId: '3',
          titulo: 'Teste1',
          descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
          materia: 'Matemática',
          autor: 'Victor Hugo',
          createdAt: new Date('2026-01-01'),
          editedAt: new Date('2026-01-01')
        },
        {
          postId: '4',
          titulo: 'Teste1',
          descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
          materia: 'Matemática',
          autor: 'Victor Hugo',
          createdAt: new Date('2026-01-01'),
          editedAt: new Date('2026-01-01')
        },
        {
          postId: '5',
          titulo: 'Teste1',
          descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
          materia: 'Matemática',
          autor: 'Victor Hugo',
          createdAt: new Date('2026-01-01'),
          editedAt: new Date('2026-01-01')
        },
        {
          postId: '6',
          titulo: 'Teste1',
          descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
          materia: 'Matemática',
          autor: 'Victor Hugo',
          createdAt: new Date('2026-01-01'),
          editedAt: new Date('2026-01-01')
        },
        {
          postId: '7',
          titulo: 'Teste1',
          descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
          materia: 'Matemática',
          autor: 'Victor Hugo',
          createdAt: new Date('2026-01-01'),
          editedAt: new Date('2026-01-01')
        },
        {
          postId: '8',
          titulo: 'Teste1',
          descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
          materia: 'Matemática',
          autor: 'Victor Hugo',
          createdAt: new Date('2026-01-01'),
          editedAt: new Date('2026-01-01')
        },
      ];
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
    <InputContainer $screenWidth={width}>
      <InnerInputContainer $screenWidth={width}>
        <InputSearch
          $screenWidth={width}
          placeholder="Pesquise aqui..."
          value={searchedText}
          onChangeText={setSearchedText}
          onFocus={() => setHideSearchResults(false)}
          onBlur={() => setHideSearchResults(true)}
        />
        <Search height={16} width={16} />
      </InnerInputContainer>
      {!hideSearchResults && searchedPostsList.length > 0 && (
        <ResultsList $screenWidth={width}>
          {searchedPostsList.map((post, i) => (
            <ListItemButton
              key={i}
              $screenWidth={width}
              onPress={() => goToPost(post.postId)}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#6f674c6b' : '#fef4d0',
              })}
            >
              <ListItem $screenWidth={width}>
                <ListItemTitle $screenWidth={width}>{post.titulo}</ListItemTitle>
                <ListItemDescription $screenWidth={width}>{post.descricao}</ListItemDescription>
              </ListItem>
            </ListItemButton>
          ))}
        </ResultsList>
      )}
    </InputContainer>
  );
}
