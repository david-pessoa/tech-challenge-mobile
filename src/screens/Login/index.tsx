import { useState } from 'react';
import { useUser } from '../../context/AuthContext';
import {
  Card,
  Container,
  ErrorMessage,
  FieldGroup,
  Greeting,
  Input,
  InputBox,
  Label,
  LoginButton,
  LoginButtonText,
  LogoBadge,
  LogoText,
  Title,
  ToggleText,
} from './styles';

/**
 * Tela de login.
 *
 * Fluxo: o usuário digita matrícula e senha -> signIn() (AuthContext) chama
 * a API, salva o token e carrega o usuário. Quando `user` passa a existir,
 * o <Stack.Protected> de app/routes.tsx redireciona sozinho para a Home,
 * então não precisamos navegar manualmente aqui.
 */
export default function Login() {
  const { signIn } = useUser();

  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit() {
    // Evita clique duplo e envio de campos vazios
    if (carregando) return;
    if (!matricula.trim() || !senha) {
      setErro('Informe matrícula e senha.');
      return;
    }

    setErro(null);
    setCarregando(true);
    try {
      await signIn(matricula.trim(), senha);
    } catch (error) {
      // signIn lança Error com a mensagem já tratada (ex: "Matrícula ou senha inválidas")
      setErro(error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Container>
      <Card>
        <LogoBadge>
          <LogoText>Fy</LogoText>
        </LogoBadge>

        <Greeting>Bem vindo(a) ao</Greeting>
        <Title>Edify</Title>

        <FieldGroup>
          <Label>Matrícula</Label>
          <InputBox>
            <Input
              placeholder="Sua matrícula..."
              value={matricula}
              onChangeText={setMatricula}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </InputBox>
        </FieldGroup>

        <FieldGroup>
          <Label>Senha</Label>
          <InputBox>
            <Input
              placeholder="Sua senha..."
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            <ToggleText
              accessibilityRole="button"
              onPress={() => setMostrarSenha(anterior => !anterior)}
            >
              {mostrarSenha ? 'Ocultar' : 'Mostrar'}
            </ToggleText>
          </InputBox>
        </FieldGroup>

        {erro && <ErrorMessage accessibilityRole="alert">{erro}</ErrorMessage>}

        <LoginButton onPress={handleSubmit} disabled={carregando} $disabled={carregando}>
          <LoginButtonText>{carregando ? 'Entrando...' : 'Login'}</LoginButtonText>
        </LoginButton>
      </Card>
    </Container>
  );
}
