import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowBack } from '@material-symbols-svg/react-native/icons/arrow-back';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PostComments from '../../components/PostComments';
import { Screen, Scroll } from '../../styles/GlobalStyles';
import { createStyles } from './styles';
import cloud from '../../../assets/images/cloudIcon.png';
import redDoodle from '../../../assets/images/red-doodle.png';
import { getPostById } from '../../services/post.service';
import { getUserById } from '../../services/user.service';
import { buildApiImageUrl, formatarData } from '../../utils/functions';
import { materias } from '../../types/Materias';
import type { PostDetails } from '../../types/Posts';
import type { User } from '../../types/User';
import { theme } from '../../styles/Theme';

type Props = {
  postId: string;
};

export default function Post({ postId }: Props) {
  const { width } = useWindowDimensions();
  const styles = createStyles(width);
  const router = useRouter();
  const [post, setPost] = useState<PostDetails>();
  const [author, setAuthor] = useState<Pick<User, 'nome' | 'image'>>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPost() {
      setIsLoading(true);
      setError('');
      setPost(undefined);
      setAuthor(undefined);
      setPhotoFailed(false);
      setAvatarFailed(false);
      try {
        if (!postId) throw new Error('Aula não encontrada.');
        const selectedPost = await getPostById(postId);
        if (!active) return;
        setPost(selectedPost);
        if (selectedPost.userId) {
          try {
            const selectedAuthor = await getUserById(selectedPost.userId);
            if (active) setAuthor(selectedAuthor);
          } catch {
            if (active) setAuthor(undefined);
          }
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Não foi possível carregar a aula.');
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadPost();
    return () => { active = false; };
  }, [postId, loadAttempt]);

  const subjectColor = materias[post?.subject?.nome ?? '']?.color ?? theme.colors.text;

  return (
    <Screen edges={['top', 'right', 'bottom', 'left']} style={styles.screen}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Scroll contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Header />
        <View key={postId} style={styles.main}>
          <View style={styles.navigation}>
            <Pressable accessibilityRole="button" onPress={() => router.replace('/home')} style={styles.backButton}>
              <ArrowBack width={24} height={24} color="#FFD600" />
              <Text style={styles.backText}>Voltar a tela de início</Text>
            </Pressable>
            <Image source={cloud} style={styles.cloud} accessible={false} />
          </View>
          {isLoading ? (
            <View style={styles.status}>
              <ActivityIndicator color={theme.colors.primary} accessibilityLabel="Carregando aula" />
              <Text style={styles.statusText}>Carregando aula...</Text>
            </View>
          ) : error ? (
            <View style={styles.status}>
              <Text accessibilityRole="alert" style={styles.statusText}>{error}</Text>
              <Pressable accessibilityRole="button" style={styles.retryButton} onPress={() => setLoadAttempt(current => current + 1)}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : post ? (
            <>
              <View style={styles.heading}>
                <Text style={[styles.subject, { color: subjectColor }]}>{post.subject?.nome}</Text>
                <View style={styles.titleRow}>
                  <Text accessibilityRole="header" style={styles.title}>{post.titulo}</Text>
                  <Image source={redDoodle} style={styles.decoration} accessible={false} />
                </View>
                <Text style={styles.description}>{post.descricao}</Text>
              </View>
              {post.image ? photoFailed ? (
                <View style={styles.imageFallback}><Text style={styles.statusText}>Imagem indisponível.</Text></View>
              ) : (
                <Image source={{ uri: buildApiImageUrl(post.image, post.dataModificacao?.toString()) }} style={styles.photo} accessibilityLabel={`Imagem da aula ${post.titulo}`} onError={() => setPhotoFailed(true)} />
              ) : null}
              <View style={styles.metadata}>
                <View style={styles.authorRow}>
                  {author?.image && !avatarFailed ? (
                    <Image source={{ uri: buildApiImageUrl(author.image) }} style={styles.avatar} accessibilityLabel={`Foto de ${author.nome}`} onError={() => setAvatarFailed(true)} />
                  ) : <View style={styles.avatar} />}
                  <Text style={styles.author}>{author?.nome ?? 'Autor indisponível'}</Text>
                </View>
                <View style={styles.dates}>
                  <Text style={styles.date}>Criado em {formatarData(post.dataCriacao)}</Text>
                  {post.dataModificacao ? <Text style={styles.date}>Editado em {formatarData(post.dataModificacao)}</Text> : null}
                </View>
              </View>
              <Text style={styles.body}>{post.conteudo}</Text>
              <PostComments key={post.postId} postId={post.postId} authorId={post.userId} authorName={author?.nome} />
            </>
          ) : null}
        </View>
        <Footer />
      </Scroll>
      </KeyboardAvoidingView>
    </Screen>
  );
}
