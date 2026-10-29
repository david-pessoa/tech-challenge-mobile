import { useNavigation, usePathname } from 'expo-router';
import { useUser } from '../../context/AuthContext';
import { buildApiImageUrl } from '../../utils/functions';

import HeaderAdmin from '../../../assets/images/HeaderAdmin.png';
import HeaderStudent from '../../../assets/images/HeaderStudent.png';
import HeaderTeach from '../../../assets/images/HeaderTeach.png';
import userImage from '../../../assets/images/user-default-image.png';
import Logo from '../../../assets/public/Logo.png';
import {
  Background,
  Circle,
  LogoButton,
  LogoImage,
  LogoutButton,
  LogoutContainer,
  Nav,
  Title,
  UserName,
} from './styles';

import { Logout } from '@material-symbols-svg/react-native/icons/logout';
import { useWindowDimensions } from 'react-native';

const roleBackgrounds = {
  ADMIN: HeaderAdmin,
  PROFESSOR: HeaderTeach,
  ALUNO: HeaderStudent,
};

export default function Header() {
  const navigation = useNavigation();
  const pathname = usePathname();
  const { user, userImageCacheKey, refreshUser, signOut } = useUser();
  const { width } = useWindowDimensions();

  const roleName = {
    ADMIN: 'Administradores',
    PROFESSOR: 'Professores',
    ALUNO: 'Alunos',
  };

  async function handleLogout() {
    try {
      await signOut();
      await refreshUser();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }

    //@ts-ignore
    navigation.navigate('/login');
  }

  function handleLogoButtonPress() {
    if (pathname !== '/home')
      //@ts-ignore
      navigation.navigate('/home');
  }

  return (
    user && (
      <Background $role={user.role} $screenWidth={width} source={roleBackgrounds[user.role]}>
        <Nav>
          <LogoButton onPress={handleLogoButtonPress} $screenWidth={width}>
            <LogoImage source={Logo} alt="Edify Logo" $screenWidth={width} />
            <Title $screenWidth={width}>Edify {roleName[user.role]}</Title>
          </LogoButton>
          <LogoutContainer $screenWidth={width}>
            <Circle
              source={
                user.image ? { uri: buildApiImageUrl(user.image, userImageCacheKey) } : userImage
              }
              $role={user.role}
              $screenWidth={width}
            />
            <UserName $screenWidth={width}>{user.nome}</UserName>
            <LogoutButton onPress={handleLogout}>
              <Logout width={width >= 600 ? 28 : 20} height={width >= 600 ? 28 : 20} />
            </LogoutButton>
          </LogoutContainer>
        </Nav>
      </Background>
    )
  );
}
