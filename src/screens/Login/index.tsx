import { type ComponentRef, useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, Platform, useWindowDimensions } from 'react-native';
import Logo from '../../../assets/public/Logo.png';
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
  LogoImage,
  Title,
  ToastCloseText,
  ToastContainer,
  ToastContent,
  ToastMessage,
  ToastTitle,
  ToggleText,
} from './styles';

export default function Login() {
  const { signIn } = useUser();

  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const { width, height } = useWindowDimensions();

  const senhaInputRef = useRef<ComponentRef<typeof Input>>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const keyboardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const deslocamentoSutil = height < 720 ? -80 : height < 850 ? -55 : -35;

    const showSubscription = Keyboard.addListener(showEvent, () => {
      Animated.timing(keyboardAnim, {
        toValue: deslocamentoSutil,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      Animated.timing(keyboardAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [height, keyboardAnim]);

  function exibirToast(mensagem: string) {
    setErro(mensagem);
    toastAnim.setValue(0);

    Animated.spring(toastAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }

  function fecharToast() {
    Animated.timing(toastAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setErro(null));
  }

  useEffect(() => {
    if (!erro) return;
    const timer = setTimeout(() => {
      fecharToast();
    }, 4000);

    return () => clearTimeout(timer);
  }, [erro]);

  async function handleSubmit() {
    if (carregando) return;
    if (!matricula.trim() || !senha) {
      exibirToast('Informe matrícula e senha.');
      return;
    }

    Keyboard.dismiss();
    setErro(null);
    setCarregando(true);
    try {
      await signIn(matricula.trim(), senha);
    } catch (error) {
      exibirToast(
        error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Container>
      {erro && (
        <ToastContainer
          style={{
            opacity: toastAnim,
            transform: [
              {
                translateY: toastAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          }}
        >
          <ToastContent>
            <ToastTitle>Atenção</ToastTitle>
            <ToastMessage>{erro}</ToastMessage>
          </ToastContent>
          <ToastCloseText onPress={fecharToast}>Fechar</ToastCloseText>
        </ToastContainer>
      )}

      <Card style={{ transform: [{ translateY: keyboardAnim }] }}>
        <LogoImage source={Logo} alt="Edify Logo" $screenWidth={width} />

        <Greeting>Bem vindo(a) ao</Greeting>
        <Title>Edify</Title>

        <FieldGroup>
          <Label>Matrícula*</Label>
          <InputBox>
            <Input
              placeholder="Sua matrícula..."
              value={matricula}
              onChangeText={setMatricula}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => senhaInputRef.current?.focus()}
            />
          </InputBox>
        </FieldGroup>

        <FieldGroup>
          <Label>Senha*</Label>
          <InputBox>
            <Input
              ref={senhaInputRef}
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