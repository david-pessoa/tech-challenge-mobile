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

export default function Home() {
  const { postResult } = useLocalSearchParams<{ postResult?: string }>();
  const { setParams } = useRouter();
  const [showPostUpdated, setShowPostUpdated] = useState(false);
  const closeToast = useCallback(() => setShowPostUpdated(false), []);

  useEffect(() => {
    if (postResult !== 'updated') return;
    setShowPostUpdated(true);
    setParams({ postResult: undefined });
  }, [postResult, setParams]);

  const { user, userImageCacheKey } = useUser();
  const { width } = useWindowDimensions();

  return (
    <Screen edges={['top', 'right', 'bottom', 'left']}>
      <Scroll>
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
                        ? { uri: buildApiImageUrl(user.image, userImageCacheKey) }
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
              {/* <SearchPostContainerInput /> */}
            </TopContainer>
            {/* <PostsContainer /> */}
          </MainContentContainer>
        </Main>
        <Footer />
      </Scroll>
      {showPostUpdated ? <Toast message="Aula atualizada com sucesso!" type="success" onClose={closeToast} /> : null}
    </Screen>
  );
}
