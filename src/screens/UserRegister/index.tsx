import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import type { Role } from '../../types/Roles';
import Footer from '../../components/Footer';
import { styles } from './styles';

const accessTypes: { label: string; value: Role }[] = [
  { label: 'Aluno', value: 'ALUNO' },
  { label: 'Professor', value: 'PROFESSOR' },
  { label: 'Administrador', value: 'ADMIN' },
];

export default function UserRegister() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [role, setRole] = useState<Role>();
  const [registration, setRegistration] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <Text accessibilityRole="header">Novo Usuário</Text>

      <View style={styles.field}>
        <Text>Nome Completo</Text>
        <TextInput
          style={styles.input}
          accessibilityLabel="Nome completo"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.field}>
        <Text>Data de nascimento</Text>
        <TextInput
          style={styles.input}
          accessibilityLabel="Data de nascimento"
          value={birthDate}
          onChangeText={setBirthDate}
          keyboardType="numbers-and-punctuation"
        />
      </View>

      <View style={styles.field}>
        <Text>Tipo de acesso</Text>
        <View style={styles.accessTypes}>
          {accessTypes.map(accessType => (
            <Pressable
              key={accessType.value}
              accessibilityRole="radio"
              accessibilityLabel={accessType.label}
              accessibilityState={{ checked: role === accessType.value }}
              onPress={() => setRole(accessType.value)}
            >
              <Text>{role === accessType.value ? '◉' : '○'} {accessType.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text>Matrícula</Text>
        <TextInput
          style={styles.input}
          accessibilityLabel="Matrícula"
          value={registration}
          onChangeText={setRegistration}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.field}>
        <Text>Senha</Text>
        <TextInput
          style={styles.input}
          accessibilityLabel="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.field}>
        <Text>Confirme sua senha</Text>
        <TextInput
          style={styles.input}
          accessibilityLabel="Confirme sua senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.footer}>
        <Footer />
      </View>
    </ScrollView>
  );
}
