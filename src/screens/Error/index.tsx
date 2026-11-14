import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ButtonGroup,
  Card,
  Container,
  Description,
  HeaderRow,
  MessageBox,
  PrimaryButton,
  PrimaryButtonText,
  SecondaryButton,
  SecondaryButtonText,
  StatusBadge,
  StatusText,
  Subtitle,
  Title,
  LogoImage
} from './styles';
import Logo from '../../../assets/public/Logo.png';
import { useWindowDimensions } from 'react-native';

type ErrorProps = {
  defaultCode?: string;
  defaultMessage?: string;
};

const ERROR_CATALOG: Record<string, { subtitle: string; title: string; fallback: string }> = {
  '401': {
    subtitle: 'Acesso restrito',
    title: 'Sessão expirada ou não autorizada',
    fallback: 'Você precisa estar autenticado para acessar este conteúdo.',
  },
  '403': {
    subtitle: 'Permissão negada',
    title: 'Você não tem acesso',
    fallback: 'Seu perfil atual não possui permissão para visualizar ou executar esta ação.',
  },
  '404': {
    subtitle: 'Não encontrado',
    title: 'Página ou recurso não encontrado',
    fallback: 'O endereço ou registro que você tentou acessar não existe ou foi removido.',
  },
  '500': {
    subtitle: 'Falha no servidor',
    title: 'Erro interno no servidor',
    fallback: 'Nosso servidor encontrou um problema inesperado. Tente novamente em instantes.',
  },
};

export default function ErrorScreen({ defaultCode, defaultMessage }: ErrorProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string; message?: string }>();
  const { width } = useWindowDimensions();

  const code = params.code || defaultCode || '500';
  const info = ERROR_CATALOG[code] || {
    subtitle: 'Ops, algo deu errado',
    title: 'Não foi possível concluir',
    fallback: 'Ocorreu um erro ao processar sua solicitação.',
  };

  const endpointMessage = params.message || defaultMessage || info.fallback;

  return (
    <Container>
      <Card>
        <HeaderRow>
          <LogoImage source={Logo} alt="Edify Logo" $screenWidth={width} />
          <StatusBadge>
            <StatusText>Erro {code}</StatusText>
          </StatusBadge>
        </HeaderRow>

        <Subtitle>{info.subtitle}</Subtitle>
        <Title>{info.title}</Title>

        <MessageBox>
          <Description>{endpointMessage}</Description>
        </MessageBox>

        <ButtonGroup>
          {router.canGoBack() && (
            <SecondaryButton onPress={() => router.back()}>
              <SecondaryButtonText>Voltar</SecondaryButtonText>
            </SecondaryButton>
          )}

          <PrimaryButton onPress={() => router.replace('/login')}>
            <PrimaryButtonText>Ir para o início</PrimaryButtonText>
          </PrimaryButton>
        </ButtonGroup>
      </Card>
    </Container>
  );
}