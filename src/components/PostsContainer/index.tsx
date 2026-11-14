import Carousel from '../Carousel';
import PostsTable from '../PostsTable';

import { getAllPosts } from '@/services/post.service';
import { Add } from '@material-symbols-svg/react-native/icons/add';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useUser } from '../../context/AuthContext';
import type { Post } from '../../types/Posts';
import {
  AddClassButton,
  AddClassButtonText,
  AddClassContainer,
  CenteredParagraph,
  Container,
  ContentContainer,
  Paragraph,
  ParagraphMarginBottom,
  Title,
} from './styles';

export default function PostsContainer() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { width } = useWindowDimensions();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setIsLoading(true);
      async function returnAllPosts() {
        try {
          const postsList = await getAllPosts();
          if (active) setPosts(postsList);
        } catch (error) {
          if (active) setPosts([]);
        }
        if (active) setIsLoading(false);
      }
      returnAllPosts();
      return () => {
        active = false;
      };
    }, [])
  );

  function goToCreateNewPost() {
    router.replace({
      pathname: '/post/new',
    });
  }

  function AlunoContainer() {
    const viewedPosts = posts.filter(p => p.foiVisto != false);
    const newPosts = posts.filter(p => p.foiVisto != true);

    return (
      <ContentContainer>
        <Container $screenWidth={width}>
          <Title $screenWidth={width}>Novas Aulas</Title>
          <ParagraphMarginBottom $screenWidth={width}>
            Últimas postagens de aulas feitas pelos seus professores
          </ParagraphMarginBottom>
          {isLoading ? (
            <ParagraphMarginBottom $screenWidth={width}>Carregando aulas...</ParagraphMarginBottom>
          ) : newPosts.length == 0 ? (
            <CenteredParagraph $screenWidth={width}>
              Você já visualizou todas as aulas!
            </CenteredParagraph>
          ) : (
            <Carousel newPosts={newPosts} />
          )}
        </Container>
        <Container $screenWidth={width}>
          <Title $screenWidth={width}>Aulas Finalizadas</Title>
          <ParagraphMarginBottom $screenWidth={width}>
            Você já finalizou estas atividades
          </ParagraphMarginBottom>
          <PostsTable type="VIEWED" dados={isLoading ? [] : viewedPosts} />
        </Container>
      </ContentContainer>
    );
  }

  function TeacherContainer() {
    const myPosts = posts.filter(p => p.criadoPor?.userId === user?.id);
    const otherPosts = posts.filter(p => p.criadoPor?.userId !== user?.id);

    return (
      <ContentContainer>
        <Container $screenWidth={width}>
          <Title $screenWidth={width}>Suas aulas</Title>
          <AddClassContainer $screenWidth={width}>
            <Paragraph $screenWidth={width}>Veja as aulas que você postou</Paragraph>
            <AddClassButton $screenWidth={width} onPress={goToCreateNewPost}>
              <Add height={width > 600 ? 32 : 24} width={width > 600 ? 32 : 24} color="#ee798a" />
              <AddClassButtonText $screenWidth={width}>Nova aula</AddClassButtonText>
            </AddClassButton>
          </AddClassContainer>
          {isLoading ? (
            <Paragraph $screenWidth={width}>Carregando aulas...</Paragraph>
          ) : (
            <PostsTable type="MY_POSTS" dados={myPosts} />
          )}
        </Container>
        <Container $screenWidth={width}>
          <Title $screenWidth={width}>Outras aulas</Title>
          <ParagraphMarginBottom $screenWidth={width}>
            Aulas criadas por outros professores
          </ParagraphMarginBottom>
          {isLoading ? (
            <Paragraph $screenWidth={width}>Carregando aulas...</Paragraph>
          ) : (
            <PostsTable type="VIEWED" dados={otherPosts} />
          )}
        </Container>
      </ContentContainer>
    );
  }

  function AdminContainer() {
    const newPosts = posts.filter(p => p.foiVisto != true);

    return (
      <ContentContainer>
        <Container $screenWidth={width}>
          <Title $screenWidth={width}>Novas aulas</Title>
          <AddClassContainer $screenWidth={width}>
            <Paragraph $screenWidth={width}>
              Últimas postagens de aulas feitas pelos professores
            </Paragraph>
            <AddClassButton $screenWidth={width} onPress={goToCreateNewPost}>
              <Add height={width > 600 ? 32 : 24} width={width > 600 ? 32 : 24} color="#ee798a" />
              <AddClassButtonText $screenWidth={width}>Nova aula</AddClassButtonText>
            </AddClassButton>
          </AddClassContainer>
          {isLoading ? (
            <Paragraph $screenWidth={width}>Carregando aulas...</Paragraph>
          ) : newPosts.length == 0 ? (
            <CenteredParagraph $screenWidth={width}>
              Você já visualizou todas as aulas!
            </CenteredParagraph>
          ) : (
            <Carousel newPosts={newPosts} />
          )}
        </Container>
        <Container $screenWidth={width}>
          <Title $screenWidth={width}>Acervo da Escola</Title>
          <ParagraphMarginBottom $screenWidth={width}>
            Todas as aulas postadas
          </ParagraphMarginBottom>
          <PostsTable type="ALL_POSTS" dados={isLoading ? [] : posts} />
        </Container>
      </ContentContainer>
    );
  }

  return (
    user && (
      <ContentContainer>
        {user.role === 'PROFESSOR' ? (
          <TeacherContainer />
        ) : user.role === 'ALUNO' ? (
          <AlunoContainer />
        ) : (
          <AdminContainer />
        )}
      </ContentContainer>
    )
  );
}
