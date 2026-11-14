import Carousel from '../Carousel';
import PostsTable from '../PostsTable';

import { getAllPosts } from '@/services/post.service';
import { Add } from '@material-symbols-svg/react-native/icons/add';
import { ChevronLeft } from '@material-symbols-svg/react-native/icons/chevron-left';
import { ChevronRight } from '@material-symbols-svg/react-native/icons/chevron-right';
import { KeyboardArrowDown } from '@material-symbols-svg/react-native/icons/keyboard-arrow-down';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Modal, useWindowDimensions } from 'react-native';
import { useUser } from '../../context/AuthContext';
import type { Post } from '../../types/Posts';
import {
  AddClassButton,
  AddClassButtonText,
  AddClassContainer,
  CenteredParagraph,
  Container,
  ContentContainer,
  OptionsOverlay,
  OptionsTitle,
  PageButton,
  PageLabel,
  PageLengthButton,
  PageLengthControl,
  PageLengthOption,
  PageLengthOptions,
  PageText,
  Pagination,
  Paragraph,
  ParagraphMarginBottom,
  Title,
} from './styles';

type PaginatedPostsTableProps = {
  title: string;
  type: 'VIEWED' | 'MY_POSTS' | 'ALL_POSTS';
  dados: Post[];
  isLoading: boolean;
  showLoadingText?: boolean;
};

function PaginatedPostsTable({
  title,
  type,
  dados,
  isLoading,
  showLoadingText = false,
}: PaginatedPostsTableProps) {
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(1);
  const [pageLength, setPageLength] = useState(5);
  const [showPageLengths, setShowPageLengths] = useState(false);

  const totalItems = dados.length;
  const totalPages = Math.ceil(totalItems / pageLength);

  useEffect(() => {
    const maxPage = Math.max(1, totalPages);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, totalPages]);

  const startIndex = (page - 1) * pageLength;
  const paginatedPosts = dados.slice(startIndex, startIndex + pageLength);

  if (isLoading && showLoadingText) {
    return <Paragraph $screenWidth={width}>Carregando aulas...</Paragraph>;
  }

  return (
    <>
      <PostsTable type={type} dados={isLoading ? [] : paginatedPosts} />

      {!isLoading && (
        <Pagination $screenWidth={width}>
          <PageLengthControl>
            <PageLabel $screenWidth={width}>Mostrar:</PageLabel>
            <PageLengthButton
              accessibilityRole="button"
              accessibilityLabel={`Quantidade de ${title.toLowerCase()} por página`}
              accessibilityValue={{ text: String(pageLength) }}
              accessibilityState={{ expanded: showPageLengths }}
              onPress={() => setShowPageLengths(true)}
            >
              <PageText $screenWidth={width}>{pageLength}</PageText>
              <KeyboardArrowDown width={20} height={20} fill="#596A86" />
            </PageLengthButton>
          </PageLengthControl>

          <PageText $screenWidth={width} accessibilityLiveRegion="polite">
            {paginatedPosts.length ? startIndex + 1 : 0}–
            {paginatedPosts.length ? startIndex + paginatedPosts.length : 0} de {totalItems}
          </PageText>

          <PageButton
            accessibilityRole="button"
            accessibilityLabel={`Página anterior de ${title.toLowerCase()}`}
            $disabled={page <= 1}
            disabled={page <= 1}
            onPress={() => setPage(currentPage => Math.max(1, currentPage - 1))}
          >
            <ChevronLeft width={24} height={24} fill="#596A86" />
          </PageButton>

          <PageButton
            accessibilityRole="button"
            accessibilityLabel={`Próxima página de ${title.toLowerCase()}`}
            $disabled={page >= totalPages}
            disabled={page >= totalPages}
            onPress={() => setPage(currentPage => Math.min(totalPages, currentPage + 1))}
          >
            <ChevronRight width={24} height={24} fill="#596A86" />
          </PageButton>
        </Pagination>
      )}

      <Modal
        visible={showPageLengths}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPageLengths(false)}
      >
        <OptionsOverlay
          onPress={() => setShowPageLengths(false)}
          accessibilityRole="button"
          accessibilityLabel="Fechar seleção de quantidade"
        >
          <PageLengthOptions accessibilityViewIsModal>
            <OptionsTitle>Itens por página</OptionsTitle>
            {[5, 10, 20].map(quantity => (
              <PageLengthOption
                key={quantity}
                accessibilityRole="radio"
                accessibilityLabel={`Mostrar ${quantity} itens`}
                accessibilityState={{ checked: pageLength === quantity }}
                $selected={pageLength === quantity}
                onPress={() => {
                  setPageLength(quantity);
                  setPage(1);
                  setShowPageLengths(false);
                }}
              >
                <PageText $screenWidth={width}>{quantity}</PageText>
              </PageLengthOption>
            ))}
          </PageLengthOptions>
        </OptionsOverlay>
      </Modal>
    </>
  );
}

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

  function renderAlunoContainer() {
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
          <PaginatedPostsTable
            title="Aulas Finalizadas"
            type="VIEWED"
            dados={viewedPosts}
            isLoading={isLoading}
          />
        </Container>
      </ContentContainer>
    );
  }

  function renderTeacherContainer() {
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
          <PaginatedPostsTable
            title="Suas aulas"
            type="MY_POSTS"
            dados={myPosts}
            isLoading={isLoading}
            showLoadingText
          />
        </Container>
        <Container $screenWidth={width}>
          <Title $screenWidth={width}>Outras aulas</Title>
          <ParagraphMarginBottom $screenWidth={width}>
            Aulas criadas por outros professores
          </ParagraphMarginBottom>
          <PaginatedPostsTable
            title="Outras aulas"
            type="VIEWED"
            dados={otherPosts}
            isLoading={isLoading}
            showLoadingText
          />
        </Container>
      </ContentContainer>
    );
  }

  function renderAdminContainer() {
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
          <PaginatedPostsTable
            title="Acervo da Escola"
            type="ALL_POSTS"
            dados={posts}
            isLoading={isLoading}
          />
        </Container>
      </ContentContainer>
    );
  }

  return (
    user && (
      <ContentContainer>
        {user.role === 'PROFESSOR'
          ? renderTeacherContainer()
          : user.role === 'ALUNO'
            ? renderAlunoContainer()
            : renderAdminContainer()}
      </ContentContainer>
    )
  );
}
