import { useCallback, useEffect, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, Image, Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import { useUser } from '../../context/AuthContext';
import { createComment, getCommentsByPostId } from '../../services/comment.service';
import type { Comment } from '../../types/Comment';
import { buildApiImageUrl } from '../../utils/functions';
import { theme } from '../../styles/Theme';
import { styles } from './styles';

type Props = {
  postId: string;
  authorId?: string | null;
  authorName?: string;
};

const avatarColors = ['#D897F2', '#D478C1', '#9ECFC7', '#F3CE99', '#FFE89C'];

function relativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `Há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  const days = Math.floor(hours / 24);
  return `Há ${days} ${days === 1 ? 'dia' : 'dias'}`;
}

function CommentAvatar({ image, name, id }: { image?: string | null; name: string; id: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image]);
  const colorIndex = Array.from(id).reduce((sum, character) => sum + character.charCodeAt(0), 0) % avatarColors.length;

  return image && !failed ? (
    <Image source={{ uri: buildApiImageUrl(image) }} style={styles.avatar} accessibilityLabel={`Foto de ${name}`} onError={() => setFailed(true)} />
  ) : <View style={[styles.avatar, { backgroundColor: avatarColors[colorIndex] }]} />;
}

export default function PostComments({ postId, authorId, authorName }: Props) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [text, setText] = useState('');
  const [sendError, setSendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment>();
  const [replyText, setReplyText] = useState('');
  const [replyError, setReplyError] = useState('');
  const [sendingReplyId, setSendingReplyId] = useState<string>();
  const [successReplyId, setSuccessReplyId] = useState<string>();
  const replyInputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const sendingRef = useRef(false);
  const mountedRef = useRef(false);
  const requestRef = useRef(0);

  const loadComments = useCallback(async () => {
    const request = ++requestRef.current;
    setIsLoading(true);
    setLoadError('');
    try {
      const result = await getCommentsByPostId(postId);
      if (mountedRef.current && request === requestRef.current) setComments(result);
    } catch (error) {
      if (mountedRef.current && request === requestRef.current) {
        setLoadError(error instanceof Error ? error.message : 'Não foi possível carregar as perguntas.');
      }
    } finally {
      if (mountedRef.current && request === requestRef.current) setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    mountedRef.current = true;
    loadComments();
    return () => {
      mountedRef.current = false;
      requestRef.current += 1;
    };
  }, [loadComments]);

  useEffect(() => {
    if (!successMessage) return;
    const timeout = setTimeout(() => {
      setSuccessMessage('');
      setSuccessReplyId(undefined);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [successMessage, successReplyId]);

  async function handleSend(parentComment?: Comment) {
    if (sendingRef.current || !user) return;
    const isReply = Boolean(parentComment);
    const content = (isReply ? replyText : text).trim();
    const setError = isReply ? setReplyError : setSendError;
    setSuccessMessage('');
    setSuccessReplyId(undefined);
    if (!content) {
      setError(isReply ? 'Digite sua resposta.' : 'Digite sua pergunta.');
      (isReply ? replyInputRef : inputRef).current?.focus();
      return;
    }
    sendingRef.current = true;
    setIsSending(true);
    setSendingReplyId(parentComment?.id);
    setError('');
    Keyboard.dismiss();
    try {
      await createComment(postId, content, parentComment?.id);
      if (!mountedRef.current) return;
      if (isReply) {
        setReplyText('');
        setReplyTo(undefined);
      } else {
        setText('');
      }
      setSuccessReplyId(parentComment?.id);
      setSuccessMessage(isReply ? 'Resposta enviada com sucesso!' : 'Pergunta enviada com sucesso!');
      await loadComments();
    } catch (error) {
      if (mountedRef.current) setError(error instanceof Error ? error.message : 'Não foi possível enviar. Tente novamente.');
    } finally {
      sendingRef.current = false;
      if (mountedRef.current) {
        setIsSending(false);
        setSendingReplyId(undefined);
      }
    }
  }

  function startReply(comment: Comment) {
    if (sendingRef.current) return;
    setReplyTo(comment);
    setReplyText('');
    setReplyError('');
    setSuccessMessage('');
    setSuccessReplyId(undefined);
  }

  return (
    <View style={styles.section}>
      <View style={[styles.composer, sendError ? styles.composerError : undefined]}>
        <TextInput
          ref={inputRef}
          accessibilityLabel="Faça uma pergunta"
          placeholder="Faça uma pergunta"
          placeholderTextColor="#603C24"
          value={text}
          onChangeText={value => { setText(value); setSendError(''); setSuccessMessage(''); }}
          multiline
          textAlignVertical="top"
          editable={!isSending && Boolean(user)}
          style={styles.input}
        />
        <View style={styles.composerActions}>
          <Pressable accessibilityRole="button" accessibilityLabel="Cancelar pergunta" disabled={isSending} onPress={() => { setText(''); setSendError(''); Keyboard.dismiss(); }} style={[styles.cancelButton, isSending ? styles.disabled : undefined]}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Enviar pergunta" accessibilityState={{ busy: isSending && !sendingReplyId }} disabled={isSending || !user} onPress={() => handleSend()} style={[styles.sendButton, isSending || !user ? styles.disabled : undefined]}>
            {isSending && !sendingReplyId ? <ActivityIndicator color="#603C24" size="small" /> : <Text style={styles.sendText}>Enviar</Text>}
          </Pressable>
        </View>
      </View>
      {sendError ? <Text accessibilityRole="alert" style={styles.error}>{sendError}</Text> : null}
      {successMessage && !successReplyId ? <Text accessibilityLiveRegion="polite" style={styles.success}>{successMessage}</Text> : null}
      <Text accessibilityRole="header" style={styles.heading}>Perguntas</Text>
      {isLoading ? <ActivityIndicator color={theme.colors.primary} accessibilityLabel="Carregando perguntas" /> : null}
      {loadError ? (
        <View style={styles.loadStatus}>
          <Text accessibilityRole="alert" style={styles.error}>{loadError}</Text>
          <Pressable accessibilityRole="button" onPress={loadComments} style={styles.textButton} disabled={isLoading}>
            <Text style={styles.actionText}>Tentar carregar perguntas novamente</Text>
          </Pressable>
        </View>
      ) : !isLoading && comments.length === 0 ? <Text style={styles.empty}>Ainda não há perguntas. Seja o primeiro a perguntar!</Text> : null}
      <View style={styles.list}>
        {comments.map(comment => (
          <View key={comment.id}>
            <View style={styles.comment}>
              <CommentAvatar id={comment.user.id} image={comment.image} name={comment.user.nome} />
              <View style={styles.commentBody}>
                <Text style={styles.name}>{comment.user.nome}</Text>
                <Text style={styles.time}>{relativeTime(comment.dataCriacao)}</Text>
                <Text style={styles.commentText}>{comment.conteudo}</Text>
                {user?.id === authorId && !comment.childComment && replyTo?.id !== comment.id && !isLoading && !loadError ? (
                  <Pressable accessibilityRole="button" accessibilityLabel={`Responder a ${comment.user.nome}`} disabled={isSending} onPress={() => startReply(comment)} style={styles.textButton}>
                    <Text style={styles.actionText}>Responder</Text>
                  </Pressable>
                ) : null}
                {replyTo?.id === comment.id ? (
                  <View style={styles.replyComposer}>
                    <Text style={styles.replyNoticeText}>Respondendo a {comment.user.nome}</Text>
                    <View style={[styles.composer, styles.replyBox, replyError ? styles.composerError : undefined]}>
                      <TextInput
                        ref={replyInputRef}
                        autoFocus
                        accessibilityLabel={`Resposta para ${comment.user.nome}`}
                        placeholder="Escreva sua resposta"
                        placeholderTextColor="#603C24"
                        value={replyText}
                        onChangeText={value => { setReplyText(value); setReplyError(''); }}
                        multiline
                        textAlignVertical="top"
                        editable={!isSending}
                        style={[styles.input, styles.replyInput]}
                      />
                      <View style={styles.composerActions}>
                        <Pressable accessibilityRole="button" accessibilityLabel={`Cancelar resposta para ${comment.user.nome}`} disabled={isSending} onPress={() => { setReplyTo(undefined); setReplyText(''); setReplyError(''); Keyboard.dismiss(); }} style={[styles.cancelButton, isSending ? styles.disabled : undefined]}>
                          <Text style={styles.cancelText}>Cancelar</Text>
                        </Pressable>
                        <Pressable accessibilityRole="button" accessibilityLabel={`Enviar resposta para ${comment.user.nome}`} accessibilityState={{ busy: sendingReplyId === comment.id }} disabled={isSending} onPress={() => handleSend(comment)} style={[styles.sendButton, isSending ? styles.disabled : undefined]}>
                          {sendingReplyId === comment.id ? <ActivityIndicator color="#603C24" size="small" /> : <Text style={styles.sendText}>Enviar</Text>}
                        </Pressable>
                      </View>
                    </View>
                    {replyError ? <Text accessibilityRole="alert" style={styles.error}>{replyError}</Text> : null}
                  </View>
                ) : null}
                {successMessage && successReplyId === comment.id ? <Text accessibilityLiveRegion="polite" style={styles.success}>{successMessage}</Text> : null}
              </View>
            </View>
            {comment.childComment ? (
              <View style={styles.reply}>
                <View style={styles.connector} />
                <View style={styles.comment}>
                  <CommentAvatar id={authorId ?? comment.childComment.id} image={comment.childComment.image} name={authorName ?? 'Autor da aula'} />
                  <View style={styles.commentBody}>
                    <Text style={styles.name}>{authorName ?? 'Autor da aula'}</Text>
                    <Text style={styles.time}>{relativeTime(comment.childComment.dataCriacao)}</Text>
                    <Text style={styles.commentText}>{comment.childComment.conteudo}</Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
