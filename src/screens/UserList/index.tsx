import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/AuthContext';
import { Screen, Scroll } from '../../styles/GlobalStyles';

function UserListSection({ title }: { title: string }) {
  return (
    <View>
      <Text accessibilityRole="header">{title}</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.column}>Foto</Text>
        <Text style={styles.column}>Nome completo</Text>
        <Text style={styles.column}>Data de nascimento</Text>
        <Text style={styles.column}>Matrícula</Text>
        <Text style={styles.column}>Ações</Text>
      </View>
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
            <UserListSection title="Administradores" />
            <UserListSection title="Professores" />
          </>
        )}
        <UserListSection title="Alunos" />
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
  },
});
