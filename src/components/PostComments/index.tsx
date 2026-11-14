import { Delete } from '@material-symbols-svg/react-native/icons/delete';
import { Edit } from '@material-symbols-svg/react-native/icons/edit';
import { useCallback, useEffect, useRef, useState, type ComponentRef } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useUser } from '../../context/AuthContext';
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
  updateComment,
} from '../../services/comment.service';
import { theme } from '../../styles/Theme';
import type { Comment } from '../../types/Comment';
import { buildApiImageUrl } from '../../utils/functions';
import { styles } from './styles';

type Props = {
  postId: string;
  authorId?: string | null;
  authorName?: string;
};

type CommentTarget = {
  id: string;
  content: string;
  ownerId?: string | null;
  name: string;
  parentId?: string;
  hasReply?: boolean;
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
  const colorIndex =
    Array.from(id).reduce((sum, character) => sum + character.charCodeAt(0), 0) %
    avatarColors.length;

  return image && !failed ? (
    <Image
      source={{ uri: buildApiImageUrl(image) }}
      style={styles.avatar}
      accessibilityLabel={`Foto de ${name}`}
      onError={() => setFailed(true)}
    />
  ) : (
    <View style={[styles.avatar, { backgroundColor: avatarColors[colorIndex] }]} />
  );
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
  const [editing, setEditing] = useState<CommentTarget>();
  const [editText, setEditText] = useState('');
  const [editError, setEditError] = useState('');
  const [pendingDelete, setPendingDelete] = useState<CommentTarget>();
  const [deleteError, setDeleteError] = useState('');
  const [mutation, setMutation] = useState<'saving' | 'deleting'>();
  const mutationRef = useRef(false);
  const isBusy = isSending || Boolean(mutation);

  const loadComments = useCallback(async () => {
    const request = ++requestRef.current;
    setIsLoading(true);
    setLoadError('');
    try {
      const result = await getCommentsByPostId(postId);
      if (mountedRef.current && request === requestRef.current) setComments(result);
    } catch (error) {
      if (mountedRef.current && request === requestRef.current) {
        setLoadError(
          error instanceof Error ? error.message : 'Não foi possível carregar as perguntas.'
        );
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
    if (sendingRef.current || mutationRef.current || !user) return;
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
      setSuccessMessage(
        isReply ? 'Resposta enviada com sucesso!' : 'Pergunta enviada com sucesso!'
      );
      await loadComments();
    } catch (error) {
      if (mountedRef.current)
        setError(
          error instanceof Error ? error.message : 'Não foi possível enviar. Tente novamente.'
        );
    } finally {
      sendingRef.current = false;
      if (mountedRef.current) {
        setIsSending(false);
        setSendingReplyId(undefined);
      }
    }
  }

  function startReply(comment: Comment) {
    if (sendingRef.current || mutationRef.current) return;
    setEditing(undefined);
    setEditText('');
    setEditError('');
    setReplyTo(comment);
    setReplyText('');
    setReplyError('');
    setSuccessMessage('');
    setSuccessReplyId(undefined);
  }

  function canEdit(target: CommentTarget) {
    return Boolean(user && user.id === target.ownerId);
  }

  function canDelete(target: CommentTarget) {
    return Boolean(
      user && (user.role === 'ADMIN' || user.id === authorId || user.id === target.ownerId)
    );
  }

  function startEdit(target: CommentTarget) {
    if (sendingRef.current || mutationRef.current || !canEdit(target)) return;
    setEditing(target);
    setEditText(target.content);
    setEditError('');
    setReplyTo(undefined);
    setReplyText('');
    setReplyError('');
    setSuccessMessage('');
  }

  async function saveEdit() {
    if (!editing || sendingRef.current || mutationRef.current || !canEdit(editing)) return;
    const content = editText.trim();
    if (!content) {
      setEditError('O comentário não pode ficar vazio.');
      return;
    }
    const target = editing;
    mutationRef.current = true;
    setMutation('saving');
    setEditError('');
    setSuccessMessage('');
    Keyboard.dismiss();
    try {
      await updateComment(target.id, content);
      if (!mountedRef.current) return;
      const updatedAt = new Date().toISOString();
      setComments(current =>
        current.map(comment => {
          if (comment.id === target.id)
            return { ...comment, conteudo: content, dataModificacao: updatedAt };
          if (comment.childComment?.id === target.id) {
            return {
              ...comment,
              childComment: {
                ...comment.childComment,
                conteudo: content,
                dataModificacao: updatedAt,
              },
            };
          }
          return comment;
        })
      );
      setEditing(undefined);
      setEditText('');
      setSuccessReplyId(target.parentId ?? target.id);
      setSuccessMessage('Comentário atualizado com sucesso!');
      await loadComments();
    } catch (error) {
      if (mountedRef.current)
        setEditError(
          error instanceof Error ? error.message : 'Não foi possível salvar o comentário.'
        );
    } finally {
      mutationRef.current = false;
      if (mountedRef.current) setMutation(undefined);
    }
  }

  function requestDelete(target: CommentTarget) {
    if (sendingRef.current || mutationRef.current || !canDelete(target)) return;
    Keyboard.dismiss();
    setDeleteError('');
    setPendingDelete(target);
  }

  async function confirmDelete() {
    if (!pendingDelete || sendingRef.current || mutationRef.current || !canDelete(pendingDelete))
      return;
    const target = pendingDelete;
    mutationRef.current = true;
    setMutation('deleting');
    setDeleteError('');
    setSuccessMessage('');
    try {
      await deleteComment(target.id);
      if (!mountedRef.current) return;
      setComments(current =>
        current
          .filter(comment => comment.id !== target.id)
          .map(comment =>
            comment.childComment?.id === target.id ? { ...comment, childComment: null } : comment
          )
      );
      if (editing?.id === target.id || editing?.parentId === target.id) setEditing(undefined);
      if (replyTo?.id === target.id) {
        setReplyTo(undefined);
        setReplyText('');
        setReplyError('');
      }
      setPendingDelete(undefined);
      setSuccessReplyId(target.parentId);
      setSuccessMessage('Comentário excluído com sucesso!');
      await loadComments();
    } catch (error) {
      if (mountedRef.current)
        setDeleteError(
          error instanceof Error ? error.message : 'Não foi possível excluir o comentário.'
        );
    } finally {
      mutationRef.current = false;
      if (mountedRef.current) setMutation(undefined);
    }
  }

  function renderActions(target: CommentTarget) {
    return (
      <View style={styles.commentActions}>
        {canEdit(target) ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Editar ${target.parentId ? 'resposta' : 'pergunta'} de ${target.name}`}
            disabled={isBusy}
            onPress={() => startEdit(target)}
            style={[styles.iconButton, isBusy ? styles.disabled : undefined]}
          >
            <Edit width={18} height={18} fill="#A15E6D" />
          </Pressable>
        ) : null}
        {canDelete(target) ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Excluir ${target.parentId ? 'resposta' : 'pergunta'} de ${target.name}`}
            disabled={isBusy}
            onPress={() => requestDelete(target)}
            style={[styles.iconButton, isBusy ? styles.disabled : undefined]}
          >
            <Delete width={18} height={18} fill="#E64B63" />
          </Pressable>
        ) : null}
      </View>
    );
  }

  function renderContent(target: CommentTarget) {
    if (editing?.id !== target.id) return <Text style={styles.commentText}>{target.content}</Text>;
    return (
      <View style={styles.replyComposer}>
        <View
          style={[styles.composer, styles.replyBox, editError ? styles.composerError : undefined]}
        >
          <TextInput
            autoFocus
            accessibilityLabel="Editar comentário"
            value={editText}
            onChangeText={value => {
              setEditText(value);
              setEditError('');
            }}
            multiline
            textAlignVertical="top"
            editable={!isBusy}
            style={[styles.input, styles.replyInput]}
          />
          <View style={styles.composerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancelar edição do comentário"
              disabled={isBusy}
              onPress={() => {
                setEditing(undefined);
                setEditText('');
                setEditError('');
                Keyboard.dismiss();
              }}
              style={[styles.cancelButton, isBusy ? styles.disabled : undefined]}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Salvar comentário"
              accessibilityState={{ busy: mutation === 'saving' }}
              disabled={isBusy}
              onPress={saveEdit}
              style={[styles.sendButton, isBusy ? styles.disabled : undefined]}
            >
              {mutation === 'saving' ? (
                <ActivityIndicator color="#603C24" size="small" />
              ) : (
                <Text style={styles.sendText}>Salvar</Text>
              )}
            </Pressable>
          </View>
        </View>
        {editError ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {editError}
          </Text>
        ) : null}
      </View>
    );
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
          onChangeText={value => {
            setText(value);
            setSendError('');
            setSuccessMessage('');
          }}
          multiline
          textAlignVertical="top"
          editable={!isBusy && Boolean(user)}
          style={styles.input}
        />
        <View style={styles.composerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancelar pergunta"
            disabled={isBusy}
            onPress={() => {
              setText('');
              setSendError('');
              Keyboard.dismiss();
            }}
            style={[styles.cancelButton, isBusy ? styles.disabled : undefined]}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Enviar pergunta"
            accessibilityState={{ busy: isSending && !sendingReplyId }}
            disabled={isBusy || !user}
            onPress={() => handleSend()}
            style={[styles.sendButton, isBusy || !user ? styles.disabled : undefined]}
          >
            {isSending && !sendingReplyId ? (
              <ActivityIndicator color="#603C24" size="small" />
            ) : (
              <Text style={styles.sendText}>Enviar</Text>
            )}
          </Pressable>
        </View>
      </View>
      {sendError ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {sendError}
        </Text>
      ) : null}
      {successMessage && !successReplyId ? (
        <Text accessibilityLiveRegion="polite" style={styles.success}>
          {successMessage}
        </Text>
      ) : null}
      <Text accessibilityRole="header" style={styles.heading}>
        Perguntas
      </Text>
      {isLoading ? (
        <ActivityIndicator color={theme.colors.primary} accessibilityLabel="Carregando perguntas" />
      ) : null}
      {loadError ? (
        <View style={styles.loadStatus}>
          <Text accessibilityRole="alert" style={styles.error}>
            {loadError}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={loadComments}
            style={styles.textButton}
            disabled={isLoading}
          >
            <Text style={styles.actionText}>Tentar carregar perguntas novamente</Text>
          </Pressable>
        </View>
      ) : !isLoading && comments.length === 0 ? (
        <Text style={styles.empty}>Ainda não há perguntas. Seja o primeiro a perguntar!</Text>
      ) : null}
      <View style={styles.list}>
        {comments.map(comment => {
          const target: CommentTarget = {
            id: comment.id,
            content: comment.conteudo,
            ownerId: comment.user.id,
            name: comment.user.nome,
            hasReply: Boolean(comment.childComment),
          };
          const replyTarget: CommentTarget | undefined = comment.childComment
            ? {
                id: comment.childComment.id,
                content: comment.childComment.conteudo,
                ownerId: authorId,
                name: authorName ?? 'Autor da aula',
                parentId: comment.id,
              }
            : undefined;
          return (
            <View key={comment.id}>
              <View style={styles.comment}>
                <CommentAvatar
                  id={comment.user.id}
                  image={comment.image}
                  name={comment.user.nome}
                />
                <View style={styles.commentBody}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentName}>{comment.user.nome}</Text>
                    {renderActions(target)}
                  </View>
                  <Text style={styles.time}>{relativeTime(comment.dataCriacao)}</Text>
                  {renderContent(target)}
                  {user?.id === authorId &&
                  !comment.childComment &&
                  replyTo?.id !== comment.id &&
                  editing?.id !== comment.id &&
                  !isLoading &&
                  !loadError ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Responder a ${comment.user.nome}`}
                      disabled={isBusy}
                      onPress={() => startReply(comment)}
                      style={styles.textButton}
                    >
                      <Text style={styles.actionText}>Responder</Text>
                    </Pressable>
                  ) : null}
                  {replyTo?.id === comment.id ? (
                    <View style={styles.replyComposer}>
                      <Text style={styles.replyNoticeText}>Respondendo a {comment.user.nome}</Text>
                      <View
                        style={[
                          styles.composer,
                          styles.replyBox,
                          replyError ? styles.composerError : undefined,
                        ]}
                      >
                        <TextInput
                          ref={replyInputRef}
                          autoFocus
                          accessibilityLabel={`Resposta para ${comment.user.nome}`}
                          placeholder="Escreva sua resposta"
                          placeholderTextColor="#603C24"
                          value={replyText}
                          onChangeText={value => {
                            setReplyText(value);
                            setReplyError('');
                          }}
                          multiline
                          textAlignVertical="top"
                          editable={!isBusy}
                          style={[styles.input, styles.replyInput]}
                        />
                        <View style={styles.composerActions}>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Cancelar resposta para ${comment.user.nome}`}
                            disabled={isBusy}
                            onPress={() => {
                              setReplyTo(undefined);
                              setReplyText('');
                              setReplyError('');
                              Keyboard.dismiss();
                            }}
                            style={[styles.cancelButton, isBusy ? styles.disabled : undefined]}
                          >
                            <Text style={styles.cancelText}>Cancelar</Text>
                          </Pressable>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Enviar resposta para ${comment.user.nome}`}
                            accessibilityState={{ busy: sendingReplyId === comment.id }}
                            disabled={isBusy}
                            onPress={() => handleSend(comment)}
                            style={[styles.sendButton, isBusy ? styles.disabled : undefined]}
                          >
                            {sendingReplyId === comment.id ? (
                              <ActivityIndicator color="#603C24" size="small" />
                            ) : (
                              <Text style={styles.sendText}>Enviar</Text>
                            )}
                          </Pressable>
                        </View>
                      </View>
                      {replyError ? (
                        <Text accessibilityRole="alert" style={styles.error}>
                          {replyError}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}
                  {successMessage && successReplyId === comment.id ? (
                    <Text accessibilityLiveRegion="polite" style={styles.success}>
                      {successMessage}
                    </Text>
                  ) : null}
                </View>
              </View>
              {comment.childComment ? (
                <View style={styles.reply}>
                  <View style={styles.connector} />
                  <View style={styles.comment}>
                    <CommentAvatar
                      id={authorId ?? comment.childComment.id}
                      image={comment.childComment.image}
                      name={authorName ?? 'Autor da aula'}
                    />
                    <View style={styles.commentBody}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentName}>{authorName ?? 'Autor da aula'}</Text>
                        {replyTarget ? renderActions(replyTarget) : null}
                      </View>
                      <Text style={styles.time}>
                        {relativeTime(comment.childComment.dataCriacao)}
                      </Text>
                      {replyTarget ? renderContent(replyTarget) : null}
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
      <Modal
        visible={Boolean(pendingDelete)}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!mutationRef.current) setPendingDelete(undefined);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteDialog} accessibilityViewIsModal>
            <Text accessibilityRole="header" style={styles.dialogTitle}>
              Excluir comentário
            </Text>
            <Text style={styles.dialogText}>
              Deseja excluir este comentário?
              {pendingDelete?.hasReply ? ' A resposta também será excluída.' : ''} Esta ação não
              pode ser desfeita.
            </Text>
            {deleteError ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {deleteError}
              </Text>
            ) : null}
            <View style={styles.composerActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cancelar exclusão do comentário"
                disabled={isBusy}
                onPress={() => setPendingDelete(undefined)}
                style={[styles.cancelButton, isBusy ? styles.disabled : undefined]}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Confirmar exclusão do comentário"
                accessibilityState={{ busy: mutation === 'deleting' }}
                disabled={isBusy}
                onPress={confirmDelete}
                style={[styles.deleteButton, isBusy ? styles.disabled : undefined]}
              >
                {mutation === 'deleting' ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.deleteText}>Excluir</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
