import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from '@/components/Toast';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useUser } from '@/context/AuthContext';
import { Screen, Scroll } from '@/styles/GlobalStyles';
import { buildApiImageUrl, capitalize } from '@/utils/functions';
import { useWindowDimensions } from 'react-native';
import redDoodle from '../../../assets/images/red-doodle.png';
import sparkle from '../../../assets/images/sparkle.png';
import userImage from '../../../assets/images/user-default-image.png';
import {
  DoodleImage,
  Figcaption,
  Figure,
  FigureContainer,
  Main,
  MainContentContainer,
  Paragraph,
  ProfileContainer,
  ProfileImage,
  ProfileImageContainer,
  SparkleImage,
  StudentName,
  Title,
  TitleContainer,
  TopContainer,
} from './styles';
import SearchPostContainerInput from '@/components/SearchPostContainerInput';
import PostsContainer from '@/components/PostsContainer';
import UserListPreview from '@/components/UserListPreview';

export default function Home() {
  const { postResult } = useLocalSearchParams<{ postResult?: string }>();
  const { setParams } = useRouter();
  const [postSuccessMessage, setPostSuccessMessage] = useState<string>();
  const closeToast = useCallback(() => setPostSuccessMessage(undefined), []);

  useEffect(() => {
    if (postResult !== 'updated' && postResult !== 'created') return;
    setPostSuccessMessage(postResult === 'created' ? 'Aula criada com sucesso!' : 'Aula atualizada com sucesso!');
    setParams({ postResult: undefined });
  }, [postResult, setParams]);

  const { user, userImageCacheKey } = useUser();
  const { width } = useWindowDimensions();

  return (
    <Screen edges={['top', 'right', 'bottom', 'left']}>
      <Scroll nestedScrollEnabled keyboardShouldPersistTaps="handled">
        <Header />
        <Main $screenWidth={width}>
          <ProfileContainer $screenWidth={width}>
            <Title $screenWidth={width}>Perfil</Title>
            <FigureContainer>
              <Figure>
                <ProfileImageContainer>
                  <DoodleImage source={redDoodle} alt="" $screenWidth={width} />
                  <ProfileImage
                    source={
                      user?.image
                        ? { uri: buildApiImageUrl(user.image, Date.now()) }
                        : userImage
                    }
                    alt={`Foto de ${user?.nome}`}
                    $screenWidth={width}
                  />
                </ProfileImageContainer>
                <Figcaption>
                  {user && <StudentName $screenWidth={width}>{user.nome}</StudentName>}
                  <Paragraph $screenWidth={width}>{capitalize(user?.role ?? 'aluno')}</Paragraph>
                </Figcaption>
              </Figure>
            </FigureContainer>
          </ProfileContainer>
          <MainContentContainer $screenWidth={width}>
            <TopContainer $screenWidth={width}>
              <TitleContainer $screenWidth={width}>
                <Title $screenWidth={width}>Tela Inicial</Title>
                <SparkleImage source={sparkle} alt="Sparkle" $screenWidth={width} />
              </TitleContainer>
              <SearchPostContainerInput />
            </TopContainer>
            <PostsContainer />
          </MainContentContainer>
          <UserListPreview />
        </Main>
        <Footer />
      </Scroll>
      {postSuccessMessage ? <Toast message={postSuccessMessage} type="success" onClose={closeToast} /> : null}
    </Screen>
  );
}
