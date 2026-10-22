import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Screen } from '@/styles/GlobalStyles';
import redDoodle from '../../../assets/images/red-doodle.png';
import userImage from '../../../assets/images/user-default-image.png';
import sparkle from '../../../assets/images/sparkle.png';
import {
  DoodleImage,
  Figcaption,
  Figure,
  FigureContainer,
  Main,
  MainContentContainer,
  ProfileContainer,
  ProfileImage,
  ProfileImageContainer,
  SparkleImage,
  StudentName,
  Title,
  TitleContainer,
  TopContainer,
} from './styles';
import { capitalize } from '@/utils/functions';
import { useUser } from '@/context/AuthContext';
import { useWindowDimensions } from 'react-native';
import { BASE_URL } from '@/services/api';

export default function Home() {
  document.title = 'Edify | Home';
  const { user } = useUser();
  const { width } = useWindowDimensions();

  return (
    <Screen edges={['top', 'right', 'bottom', 'left']}>
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
                <p>{capitalize(user?.role ?? 'aluno')}</p>
              </Figcaption>
            </Figure>
          </FigureContainer>
        </ProfileContainer>
        <MainContentContainer $screenWidth={width}>
          {/* <TopContainer>
            <TitleContainer>
              <Title $screenWidth={width}>Tela Inicial</Title>
              <SparkleImage source={sparkle} alt="Sparkle" />
            </TitleContainer>
            <SearchPostContainerInput />
          </TopContainer>
          <PostsContainer /> */}
        </MainContentContainer>
      </Main>
      <Footer />
    </Screen>
  );
}
