import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { ActivityIndicator, Image, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { Add, ArrowBack, ChevronLeft, ChevronRight, Delete, Edit } from '@material-symbols-svg/react-native';
import { createStyles } from './styles';
import { theme } from '../../styles/Theme';
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
  const { user } = useUser();
  const { width } = useWindowDimensions();
  const iconSize = width >= 600 ? 20 : 14;
  const styles = createStyles(width);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      setIsLoading(true);
      setError('');
      try {
        const response = await getAllUsers({ role, p: page, l: 10 });
        if (active) {
          setUsers(response.users);
          setTotalPages(response.pagination.totalPages);
        }
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
  }, [role, retryCount, page]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} accessibilityRole="header">{title}</Text>
      <View style={styles.tableHeader}>
        <View style={[styles.column, styles.photoColumn]}>
          <Text style={styles.headerText}>Foto</Text>
        </View>
        <View style={[styles.column, styles.nameColumn]}>
          <Text style={styles.headerText}>Nome completo</Text>
        </View>
        <View style={[styles.column, styles.dateColumn]}>
          <Text style={styles.headerText}>Data de nascimento</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.headerText}>Matrícula</Text>
        </View>
        <View style={[styles.column, styles.actionsColumn]}>
          <Text style={styles.headerText}>Ações</Text>
        </View>
      </View>
      {isLoading ? (
        <View style={styles.status}>
          <ActivityIndicator color={theme.colors.primary} accessibilityLabel={`Carregando ${title.toLowerCase()}`} />
        </View>
      ) : error ? (
        <View style={styles.status}>
          <Text style={[styles.statusText, styles.errorText]} accessibilityRole="alert">{error}</Text>
          <Pressable accessibilityRole="button" style={styles.retryButton} onPress={() => setRetryCount(value => value + 1)}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.status}>
          <Text style={styles.statusText}>Nenhum usuário encontrado.</Text>
        </View>
      ) : (
        users.map(listedUser => (
          <View key={listedUser.id} style={styles.row}>
            <View style={[styles.column, styles.photoColumn]}>
              <Image
                source={listedUser.image ? { uri: buildApiImageUrl(listedUser.image) } : defaultUserImage}
                style={styles.photo}
                accessibilityLabel={`Foto de ${listedUser.nome}`}
              />
            </View>
            <View style={[styles.column, styles.nameColumn]}>
              <Text style={styles.cellText}>{listedUser.nome}</Text>
            </View>
            <View style={[styles.column, styles.dateColumn]}>
              <Text style={styles.cellText}>{formatBirthDate(listedUser.birthDate)}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.cellText}>{listedUser.matricula}</Text>
            </View>
            <View style={[styles.column, styles.actionsColumn, styles.actionIcons]}>
              <Edit width={iconSize} height={iconSize} fill="#A15E6D" accessibilityLabel={`Editar ${listedUser.nome}`} />
              {user?.role === 'ADMIN' && (
                <Delete width={iconSize} height={iconSize} fill="#E64B63" accessibilityLabel={`Excluir ${listedUser.nome}`} />
              )}
            </View>
          </View>
        ))
      )}
      {!isLoading && !error && totalPages > 0 && (
        <View style={styles.pagination}>
          <Text style={styles.pageText} accessibilityLiveRegion="polite">Mostrar {page} de {totalPages}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Página anterior de ${title.toLowerCase()}`}
            style={[styles.pageButton, page <= 1 && styles.disabled]}
            disabled={page <= 1}
            onPress={() => setPage(currentPage => Math.max(1, currentPage - 1))}
          >
            <ChevronLeft width={24} height={24} fill="#596A86" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Próxima página de ${title.toLowerCase()}`}
            style={[styles.pageButton, page >= totalPages && styles.disabled]}
            disabled={page >= totalPages}
            onPress={() => setPage(currentPage => Math.min(totalPages, currentPage + 1))}
          >
            <ChevronRight width={24} height={24} fill="#596A86" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function UserList() {
  const { user } = useUser();
  const { width } = useWindowDimensions();
  const styles = createStyles(width);

  return (
    <Screen style={styles.screen} edges={['top', 'right', 'bottom', 'left']}>
      <Scroll contentContainerStyle={styles.content}>
        <Header />
        <View style={styles.main}>
          <Text style={styles.title} accessibilityRole="header">Lista completa</Text>
          <View style={styles.navigation}>
            <Link href="/home" asChild>
              <Pressable style={styles.link} accessibilityRole="link">
                <ArrowBack width={22} height={22} fill={theme.colors.backIcon} />
                <Text style={styles.linkText}>Voltar à tela de início</Text>
              </Pressable>
            </Link>
            <Link href="/user-register" asChild>
              <Pressable style={styles.link} accessibilityRole="link">
                <Add width={24} height={24} fill="#EE798A" />
                <Text style={styles.linkText}>Novo Usuário</Text>
              </Pressable>
            </Link>
          </View>
          {user?.role === 'ADMIN' && (
            <>
              <UserListSection title="Administradores" role="ADMIN" />
              <UserListSection title="Professores" role="PROFESSOR" />
            </>
          )}
          <UserListSection title="Alunos" role="ALUNO" />
        </View>
        <Footer />
      </Scroll>
    </Screen>
  );
}
