import { useUser } from '@/context/AuthContext';
import { deletePost } from '@/services/post.service';
import { Post } from '@/types/Posts';
import { formatarData } from '@/utils/functions';
import { Delete, Edit } from '@material-symbols-svg/react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, useWindowDimensions, View } from 'react-native';
import MateriaIcon from './MateriaIcon';
import { createStyles } from './styles';

type PostsTableProps = {
  dados: Post[];
  type: 'VIEWED' | 'MY_POSTS' | 'ALL_POSTS';
};

export default function PostsTable({ dados, type }: PostsTableProps) {
  const { width } = useWindowDimensions();
  const { user } = useUser();
  const [pendingDelete, setPendingDelete] = useState<Post>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  }>();
  const [pressedRow, setPressedRow] = useState('');

  const iconSize = width >= 600 ? 20 : 14;
  const styles = createStyles(width);

  function requestDelete(post: Post) {
    if (user?.role === 'ALUNO' || isDeleting) return;
    setNotification(undefined);
    setPendingDelete(post);
  }

  async function confirmDelete() {
    if (!pendingDelete || isDeleting) return;
    const selectedPost = pendingDelete;
    setIsDeleting(true);
    try {
      await deletePost(selectedPost.postId);
      setPendingDelete(undefined);
      setNotification({ message: 'Post excluído com sucesso!', type: 'success' });
    } catch (error) {
      setPendingDelete(undefined);
      setNotification({
        message: error instanceof Error ? error.message : 'Não foi possível excluir o post.',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <View style={styles.section}>
      <View style={styles.tableHeader}>
        <View style={[styles.column, styles.photoColumn]}>
          <Text style={styles.headerText}>Matérias</Text>
        </View>
        <View style={[styles.column, styles.nameColumn]}>
          <Text style={styles.headerText}>Título</Text>
        </View>
        <View style={[styles.column, styles.dateColumn]}>
          <Text style={styles.headerText}>Descrição</Text>
        </View>
        {width > 600 && (
          <View style={[styles.column, styles.dateColumn]}>
            <Text style={styles.headerText}>Data de Criação</Text>
          </View>
        )}
        {width > 600 && (
          <View style={[styles.column, styles.dateColumn]}>
            <Text style={styles.headerText}>Data de Modificação</Text>
          </View>
        )}
        {type !== 'MY_POSTS' && (
          <View style={styles.column}>
            <Text style={styles.headerText}>Professor</Text>
          </View>
        )}
        {type !== 'VIEWED' && (
          <View style={[styles.column, styles.actionsColumn]}>
            <Text style={styles.headerText}>Ações</Text>
          </View>
        )}
      </View>
      {dados.length === 0 ? (
        <View style={styles.status}>
          <Text style={styles.statusText}>
            {user?.role === 'ALUNO'
              ? 'Você ainda não finalizou nenhuma atividade.'
              : user?.role === 'ADMIN'
                ? 'Não há aulas para visulizar'
                : type === 'MY_POSTS'
                  ? 'Você ainda não publicou nenhuma aula'
                  : 'Nenhum outro professor publicou aulas'}
          </Text>
        </View>
      ) : (
        dados.map(post => (
          <View key={post.postId} style={styles.row}>
            <View style={[styles.column, styles.photoColumn]}>
              <MateriaIcon subject={post?.subject?.nome ?? 'Geral'} />
            </View>
            <View
              style={[
                styles.column,
                styles.nameColumn,
                { height: 50 },
                pressedRow === post.postId && styles.pressedRow,
              ]}
            >
              <Link href={{ pathname: '/post/[postId]', params: { postId: post.postId } }} asChild>
                <Pressable
                  accessibilityRole="link"
                  onPressIn={() => setPressedRow(post.postId)}
                  onPressOut={() => setPressedRow('')}
                >
                  <Text
                    style={[styles.cellTextBold, { maxWidth: '100%' }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    accessibilityLabel={post.titulo}
                  >
                    {post.titulo}
                  </Text>
                </Pressable>
              </Link>
            </View>
            <View style={[styles.column, styles.dateColumn]}>
              <Text
                style={styles.cellText}
                numberOfLines={3}
                ellipsizeMode="tail"
                accessibilityLabel={post.descricao}
              >
                {post.descricao}
              </Text>
            </View>
            {width > 600 && (
              <View style={[styles.column, styles.dateColumn]}>
                <Text style={styles.cellText}>{formatarData(post.dataCriacao)}</Text>
              </View>
            )}
            {width > 600 && (
              <View style={[styles.column, styles.dateColumn]}>
                <Text style={styles.cellText}>{formatarData(post.dataModificacao)}</Text>
              </View>
            )}
            {type !== 'MY_POSTS' && (
              <View style={styles.column}>
                <Text style={styles.cellText}>{post.criadoPor?.nome}</Text>
              </View>
            )}
            {type !== 'VIEWED' && (
              <View style={[styles.column, styles.actionsColumn, styles.actionIcons]}>
                <Link
                  href={{ pathname: '/post/edit/[postId]', params: { postId: post.postId } }}
                  asChild
                >
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel={`Editar ${post.titulo}`}
                    style={styles.editButton}
                  >
                    <Edit width={iconSize} height={iconSize} fill="#A15E6D" />
                  </Pressable>
                </Link>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Excluir ${post.titulo}`}
                  style={styles.editButton}
                  onPress={() => requestDelete(post)}
                >
                  <Delete width={iconSize} height={iconSize} fill="#E64B63" />
                </Pressable>
              </View>
            )}
          </View>
        ))
      )}
      <Modal
        visible={Boolean(pendingDelete)}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isDeleting) setPendingDelete(undefined);
        }}
      >
        <View style={styles.optionsOverlay}>
          <View style={styles.deleteDialog} accessibilityViewIsModal>
            <Text style={styles.optionsTitle}>Excluir post</Text>
            <Text style={styles.deleteMessage}>
              Deseja excluir o post {pendingDelete?.titulo} criado por{' '}
              {pendingDelete?.criadoPor?.nome}? Esta ação não pode ser desfeita.
            </Text>
            <View style={styles.deleteActions}>
              <Pressable
                style={[
                  styles.dialogButton,
                  styles.cancelDeleteButton,
                  isDeleting && styles.disabled,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Cancelar exclusão"
                disabled={isDeleting}
                onPress={() => setPendingDelete(undefined)}
              >
                <Text style={styles.cancelDeleteText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.dialogButton,
                  styles.confirmDeleteButton,
                  isDeleting && styles.disabled,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Confirmar exclusão"
                accessibilityState={{ disabled: isDeleting, busy: isDeleting }}
                disabled={isDeleting}
                onPress={confirmDelete}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmDeleteText}>Excluir</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
