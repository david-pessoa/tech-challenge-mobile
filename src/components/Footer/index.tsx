import { Image, useWindowDimensions } from 'react-native';
import logo from '../../../assets/public/Logo.png';
import {
  BottomContainer,
  Box,
  DescriptionContainer,
  FooterContainer,
  LogoContainer,
  Paragraph,
  Title,
  UpperContainer,
} from './styles';


export default function Footer() {
  const { width } = useWindowDimensions();
  
  return (
    <FooterContainer $screenWidth={width}>
      <Box $screenWidth={width}>
        <UpperContainer $screenWidth={width}>
          <DescriptionContainer $screenWidth={width}>
            <LogoContainer $screenWidth={width}>
              <Image
                source={logo}
                accessibilityLabel="Edify Logo"
                style={{ width: 47, height: 44 }}
              />
              <Title>Edify</Title>
            </LogoContainer>
            <Paragraph $screenWidth={width} >
              O Edify conecta professores e alunos da rede pública, oferecendo um espaço seguro,
              {width > 900 ? '\n' : ' '}
              gratuito e divertido para reforço escolar e muito aprendizado.
            </Paragraph>
          </DescriptionContainer>
        </UpperContainer>
        <BottomContainer $screenWidth={width}>
          <Paragraph $screenWidth={width}>
            &copy; {new Date().getFullYear()} Edify. Todos os direitos reservados.
          </Paragraph>
          <Paragraph $screenWidth={width}>
            Política de Privacidade | Termos de Uso | Configurações de Cookies
          </Paragraph>
        </BottomContainer>
      </Box>
    </FooterContainer>
  );
}
