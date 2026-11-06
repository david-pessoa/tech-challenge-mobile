import { ArrowRightAlt, Delete, Edit } from '@material-symbols-svg/react-native';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Pressable, useWindowDimensions, View, Text, ActivityIndicator } from 'react-native';
import { useUser } from '../../context/AuthContext';
import { deleteUser, getAllUsers } from '../../services/user.service';
import type { User } from '../../types/User';
import { buildApiImageUrl, capitalize } from '../../utils/functions';
import userImage from '../assets/user-default-image.png';
import {
  AccessUserListButton,
  ActionContainer,
  createStyles,
  DeleteButton,
  EditButton,
  Item,
  SentenceText,
  UserList,
  UserListContainer,
  UserListTitle,
  UserName,
  UserNameRoleContainer,
  UserProfilePhoto,
  UserRole,
} from './styles';

export default function UserListPreview() {
  const { user: loggedUser, userImageCacheKey } = useUser();
  const [pendingDelete, setPendingDelete] = useState<User>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  }>();
  const [allUsersList, setAllUsersList] = useState<User[]>([]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    async function getAllUsersList() {
      const userListResponse = await getAllUsers();
      const miniList = userListResponse.users
        .filter((user: User) => user.id !== loggedUser?.id)
        .slice(0, 5);
      setAllUsersList(miniList);
    }
    if (loggedUser?.role !== 'ALUNO') getAllUsersList();
  }, []);

  const styles = createStyles(width);

  function requestDelete(user: User) {
    if (loggedUser?.role === 'ALUNO' || isDeleting) return;
    setNotification(undefined);
    setPendingDelete(user);
  }

  async function confirmDelete() {
    if (!pendingDelete || isDeleting) return;
    const selectedUser = pendingDelete;
    setIsDeleting(true);
    try {
      await deleteUser(selectedUser.id);
      setPendingDelete(undefined);
      setNotification({ message: 'Aluno excluído com sucesso!', type: 'success' });
    } catch (error) {
      setPendingDelete(undefined);
      setNotification({
        message: error instanceof Error ? error.message : 'Não foi possível excluir o aluno.',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>

      {loggedUser?.role !== 'ALUNO' && (
        <UserListContainer $screenWidth={width}>
          <UserListTitle $screenWidth={width}>Todos os Usuários</UserListTitle>
          <UserList>
            {allUsersList.map(user => (
              <Item key={user.id}>
                <View>
                  <UserProfilePhoto
                    source={
                      user?.image
                        ? { uri: buildApiImageUrl(user.image, userImageCacheKey) }
                        : userImage
                    }
                    alt={`Foto de perfil da ${user.nome}`}
                  />
                </View>
                <UserNameRoleContainer>
                  <UserName>{user.nome}</UserName>
                  <UserRole>
                    {user.role === 'ADMIN' ? 'Administrador' : capitalize(user.role)}
                  </UserRole>
                </UserNameRoleContainer>
                <ActionContainer>
                  <Link
                    href={{ pathname: '/user-edit/[userId]', params: { userId: user.id } }}
                    asChild
                  >
                    <EditButton accessibilityLabel={`Editar ${user.nome}`}>
                      <Edit color="#a15e6d" size={24} />
                    </EditButton>
                  </Link>

                  {loggedUser?.role === 'ADMIN' && user.id !== loggedUser?.id && (
                    <DeleteButton
                      onPress={() => requestDelete(user)}
                      accessibilityLabel={`Deletar ${user.nome}`}
                    >
                      <Delete color="#e64b63" size={24} />
                    </DeleteButton>
                  )}
                </ActionContainer>
              </Item>
            ))}
          </UserList>
          <Link href={{ pathname: '/user-list' }} asChild>
            <AccessUserListButton>
              <SentenceText>Acessar lista completa</SentenceText>
              <ArrowRightAlt size={30} color="#efa488" style={{ marginLeft: 30 }} />
            </AccessUserListButton>
          </Link>
        </UserListContainer>
      )}
      <Modal
        visible={Boolean(pendingDelete && loggedUser?.role === 'ADMIN')}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isDeleting) setPendingDelete(undefined);
        }}
      >
        <View style={styles.optionsOverlay}>
          <View style={styles.deleteDialog} accessibilityViewIsModal>
            <Text style={styles.optionsTitle}>Excluir Aluno</Text>
            <Text style={styles.deleteMessage}>
              Deseja excluir o aluno {pendingDelete?.nome}? Esta ação não pode ser desfeita.
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
    </>
  );
}
