import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { ActivityIndicator, Button, Image, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/AuthContext';
import { Screen, Scroll } from '../../styles/GlobalStyles';
import { getAllUsers } from '../../services/user.service';
import type { Role } from '../../types/Roles';
import type { UserListItem } from '../../types/UserList';
import { buildApiImageUrl } from '../../utils/functions';
import defaultUserImage from '../../../assets/images/user-default-image.png';

function formatBirthDate(date: string | null) {
  if (!date) return '--';
  const [year, month, day] = date.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

function UserListSection({ title, role }: { title: string; role: Role }) {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      setIsLoading(true);
      setError('');
      try {
        const response = await getAllUsers({ role, p: 1, l: 10 });
        if (active) setUsers(response.users);
      } catch (error) {
        if (active) {
          setError(error instanceof Error ? error.message : 'Não foi possível carregar os usuários.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadUsers();
    return () => {
      active = false;
    };
  }, [role, retryCount]);

  return (
    <View>
      <Text accessibilityRole="header">{title}</Text>
      <View style={styles.tableHeader}>
        <View style={styles.column}><Text>Foto</Text></View>
        <View style={styles.column}><Text>Nome completo</Text></View>
        <View style={styles.column}><Text>Data de nascimento</Text></View>
        <View style={styles.column}><Text>Matrícula</Text></View>
        <View style={styles.column}><Text>Ações</Text></View>
      </View>
      {isLoading ? (
        <ActivityIndicator accessibilityLabel={`Carregando ${title.toLowerCase()}`} />
      ) : error ? (
        <View>
          <Text accessibilityRole="alert">{error}</Text>
          <Button title="Tentar novamente" onPress={() => setRetryCount(value => value + 1)} />
        </View>
      ) : users.length === 0 ? (
        <Text>Nenhum usuário encontrado.</Text>
      ) : (
        users.map(listedUser => (
          <View key={listedUser.id} style={styles.tableHeader}>
            <View style={styles.column}>
              <Image
                source={listedUser.image ? { uri: buildApiImageUrl(listedUser.image) } : defaultUserImage}
                style={styles.photo}
                accessibilityLabel={`Foto de ${listedUser.nome}`}
              />
            </View>
            <View style={styles.column}>
              <Text>{listedUser.nome}</Text>
            </View>
            <View style={styles.column}>
              <Text>{formatBirthDate(listedUser.birthDate)}</Text>
            </View>
            <View style={styles.column}>
              <Text>{listedUser.birthDate}</Text>
            </View>
            <View style={styles.column} />
          </View>
        ))
      )}
    </View>
  );
}

export default function UserList() {
  const { user } = useUser();

  return (
    <Screen edges={['top', 'right', 'bottom', 'left']}>
      <Scroll>
        <Header />
        <View>
          <Text accessibilityRole="header">Lista completa</Text>
          <View>
            <Link href="/home">Voltar à tela de início</Link>
            <Link href="/user-register">Novo Usuário</Link>
          </View>
        </View>
        {user?.role === 'ADMIN' && (
          <>
            <UserListSection title="Administradores" role="ADMIN" />
            <UserListSection title="Professores" role="PROFESSOR" />
          </>
        )}
        <UserListSection title="Alunos" role="ALUNO" />
        <Footer />
      </Scroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    minWidth: 0,
  },
  photo: {
    width: 40,
    height: 40,
  },
});
