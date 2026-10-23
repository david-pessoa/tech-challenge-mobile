import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useUser } from '@/context/AuthContext';
import { BASE_URL } from '@/services/api';
import { Screen, Scroll } from '@/styles/GlobalStyles';
import { capitalize } from '@/utils/functions';
import { useRouter } from 'expo-router';
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
  const { user } = useUser();
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
                  source={user?.image ? `${BASE_URL}${user?.image}` : userImage}
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
    </Screen>
  );
}
