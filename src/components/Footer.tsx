import { Text, View } from 'react-native';

export default function Footer() {
  return (
    <View>
      <Text>Edify</Text>
      <Text>
        O Edify conecta professores e alunos da rede pública, oferecendo um espaço
        seguro, gratuito e divertido para reforço escolar e muito aprendizado.
      </Text>

      <View>
        <Text>Como Funciona</Text>
        <Text>Nossas Matérias</Text>
        <Text>Central de Ajuda</Text>
        <Text>Dicas de Estudo</Text>
        <Text>Suporte Técnico</Text>
        <Text>Fale Conosco</Text>
      </View>

      <Text>© {new Date().getFullYear()} Edify. Todos os direitos reservados.</Text>
      <Text>Política de Privacidade | Termos de Uso | Configurações de Cookies</Text>
    </View>
  );
}
