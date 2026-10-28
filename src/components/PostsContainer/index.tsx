import Carousel from '../Carousel';
import PostsTable from '../PostsTable';

// import 'swiper/css';

import { Add } from '@material-symbols-svg/react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
  Title,
} from './styles';

export default function PostsContainer() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { width } = useWindowDimensions();
  const router = useRouter();

  useEffect(() => {
    async function returnAllPosts() {
      try {
        // const postsList = await getAllPosts();
        const postsList: Post[] = [
          {
            postId: '1',
            titulo: 'Teste1',
            descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
            materia: 'Matemática',
            autor: 'Victor Hugo',
            createdAt: new Date('2026-01-01'),
            editedAt: new Date('2026-01-01'),
            foiVisto: true,
            criadoPor: {
              nome: 'Roberta',
              tipoUsuario: 'PROFESSOR',
              image: null,
              userId: 'outro'
            }
          },
          {
            postId: '2',
            titulo: 'Teste2',
            descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
            materia: 'Matemática',
            autor: 'Victor Hugo',
            createdAt: new Date('2026-01-01'),
            editedAt: new Date('2026-01-01'),
            foiVisto: true,
            criadoPor: {
              nome: 'Roberta',
              tipoUsuario: 'PROFESSOR',
              image: null,
              userId: 'outro'
            }
          },
          {
            postId: '3',
            titulo: 'Teste3',
            descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
            materia: 'Matemática',
            autor: 'Victor Hugo',
            createdAt: new Date('2026-01-01'),
            editedAt: new Date('2026-01-01'),
            foiVisto: true,
            criadoPor: {
              nome: 'Roberta',
              tipoUsuario: 'PROFESSOR',
              image: null,
              userId: 'outro'
            }
          },
          {
            postId: '4',
            titulo: 'Teste4',
            descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
            materia: 'Matemática',
            autor: 'Victor Hugo',
            createdAt: new Date('2026-01-01'),
            editedAt: new Date('2026-01-01'),
            foiVisto: true,
            criadoPor: {
              nome: 'Roberta',
              tipoUsuario: 'PROFESSOR',
              image: null,
              userId: 'outro'
            }
          },
          {
            postId: '5',
            titulo: 'Teste5',
            descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
            materia: 'Matemática',
            autor: 'Victor Hugo',
            createdAt: new Date('2026-01-01'),
            editedAt: new Date('2026-01-01'),
            foiVisto: false,
            criadoPor: {
              nome: 'Roberta',
              tipoUsuario: 'PROFESSOR',
              image: null,
              userId: 'outro'
            }
          },
          {
            postId: '6',
            titulo: 'Teste6',
            descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
            materia: 'Matemática',
            autor: 'Victor Hugo',
            createdAt: new Date('2026-01-01'),
            editedAt: new Date('2026-01-01'),
            foiVisto: false,
            criadoPor: {
              nome: 'Roberta',
              tipoUsuario: 'PROFESSOR',
              image: null,
              userId: 'outro'
            }
          },
          {
            postId: '7',
            titulo: 'Teste7',
            descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
            materia: 'Matemática',
            autor: 'Victor Hugo',
            createdAt: new Date('2026-01-01'),
            editedAt: new Date('2026-01-01'),
            foiVisto: false,
            criadoPor: {
              nome: 'Camila',
              tipoUsuario: 'PROFESSOR',
              image: null,
              userId: 'c2b58a4e-c4cf-4e20-978c-c1f2793ee18c'
            }
          },
          {
            postId: '8',
            titulo: 'Teste8',
            descricao: 'Lorem Ipsum dolor sit amet arroz com feijão',
            materia: 'Matemática',
            autor: 'Victor Hugo',
            createdAt: new Date('2026-01-01'),
            editedAt: new Date('2026-01-01'),
            foiVisto: false,
            criadoPor: {
              nome: 'Camila',
              tipoUsuario: 'PROFESSOR',
              image: null,
              userId: 'c2b58a4e-c4cf-4e20-978c-c1f2793ee18c'
            }
          },
        ];
        setPosts(postsList);
      } catch (error) {
        setPosts([]);
      }
      setIsLoading(false);
    }
    returnAllPosts();
  }, []);

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
          <Paragraph $screenWidth={width}>
            Últimas postagens de aulas feitas pelos seus professores
          </Paragraph>
          {isLoading ? (
            <Paragraph $screenWidth={width}>Carregando aulas...</Paragraph>
          ) : newPosts.length == 0 ? (
            <CenteredParagraph $screenWidth={width}>
              Você já visualizou todas as aulas!
            </CenteredParagraph>
          ) : (
            <Carousel newPosts={newPosts} isAdmin={false} />
          )}
        </Container>
        <Container $screenWidth={width}>
          <Title $screenWidth={width}>Aulas Finalizadas</Title>
          <Paragraph $screenWidth={width}>Você já finalizou estas atividades</Paragraph>
          <PostsTable dados={isLoading ? [] : viewedPosts} />
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
            <PostsTable dados={myPosts} />
          )}
        </Container>
        <Container $screenWidth={width}>
          <Title $screenWidth={width}>Outras aulas</Title>
          <Paragraph $screenWidth={width}>Aulas criadas por outros professores</Paragraph>
          {isLoading ? (
            <Paragraph $screenWidth={width}>Carregando aulas...</Paragraph>
          ) : (
            <PostsTable dados={otherPosts} />
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
              <p>Nova aula</p>
            </AddClassButton>
          </AddClassContainer>
          {isLoading ? (
            <Paragraph $screenWidth={width}>Carregando aulas...</Paragraph>
          ) : newPosts.length == 0 ? (
            <CenteredParagraph $screenWidth={width}>
              Você já visualizou todas as aulas!
            </CenteredParagraph>
          ) : (
            <Carousel newPosts={newPosts} isAdmin={false} />
          )}
        </Container>
        <Container $screenWidth={width}>
          <Title $screenWidth={width}>Acervo da Escola</Title>
          <Paragraph $screenWidth={width}>Todas as aulas postadas</Paragraph>
          <PostsTable dados={isLoading ? [] : posts} />
        </Container>
      </ContentContainer>
    );
  }

  return (
    user && (
      <div>
        {user.role === 'PROFESSOR' ? (
          <TeacherContainer />
        ) : user.role === 'ALUNO' ? (
          <AlunoContainer />
        ) : (
          <AdminContainer />
        )}
      </div>
    )
  );
}
