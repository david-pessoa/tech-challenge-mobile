import { Image, Text, View } from 'react-native';
import { styles } from './Footer.styles';

const links = [
  'Como Funciona', 'Nossas Matérias', 'Central de Ajuda',
  'Dicas de Estudo', 'Suporte Técnico', 'Fale Conosco',
];

export default function Footer() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.brand}>
          <Image source={require('../../assets/images/logoEdify.png')} style={styles.logo} accessibilityLabel="Edify" />
          <Text style={styles.name}>Edify</Text>
        </View>
        <Text style={styles.text}>
          O Edify conecta professores e alunos da rede pública, oferecendo um espaço
          seguro, gratuito e divertido para reforço escolar e muito aprendizado.
        </Text>
        <View style={styles.links}>
          {links.map(link => <Text key={link} style={styles.linkText}>{link}</Text>)}
        </View>
        <View style={styles.bottom}>
          <Text style={[styles.text, styles.column]}>© {new Date().getFullYear()} Edify. Todos os direitos reservados.</Text>
          <Text style={[styles.text, styles.column]}>Política de Privacidade | Termos de Uso | Configurações de Cookies</Text>
        </View>
      </View>
    </View>
  );
}
