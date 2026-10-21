import { useState } from 'react';
import { Button, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import type { Role } from '../../types/Roles';
import Footer from '../../components/Footer';
import { createUser } from '../../services/user.service';
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
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit() {
    if (isSaving) return;
    setMessage('');

    if (!name.trim()) {
      setMessage('Informe o nome completo.');
      return;
    }

    if (!registration.trim()) {
      setMessage('Informe a matrícula.');
      return;
    }

    if (!role) {
      setMessage('Selecione o tipo de acesso.');
      return;
    }

    if (!password.trim()) {
      setMessage('Informe a senha.');
      return;
    }

    if (!confirmPassword) {
      setMessage('Confirme sua senha.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }

    const data = new FormData();
    data.append('nome', name.trim());
    data.append('matricula', registration.trim());
    data.append('role', role);
    data.append('senha', password);

    if (birthDate.trim()) {
      const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(birthDate.trim());

      if (!match) {
        setMessage('Informe a data de nascimento no formato DD/MM/AAAA.');
        return;
      }

      const [, day, month, year] = match;
      const formattedDate = `${year}-${month}-${day}`;
      const date = new Date(`${formattedDate}T00:00:00`);

      if (
        Number.isNaN(date.getTime()) ||
        date.getDate() !== Number(day) ||
        date.getMonth() + 1 !== Number(month) ||
        date.getFullYear() !== Number(year)
      ) {
        setMessage('Informe uma data de nascimento válida.');
        return;
      }

      if (date > new Date()) {
        setMessage('A data de nascimento não pode ser futura.');
        return;
      }

      data.append('birthDate', formattedDate);
    }

    setIsSaving(true);

    try {
      await createUser(data);
      setName('');
      setBirthDate('');
      setRole(undefined);
      setRegistration('');
      setPassword('');
      setConfirmPassword('');
      setMessage('Usuário cadastrado com sucesso!');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível cadastrar o usuário.');
    } finally {
      setIsSaving(false);
    }
  }


  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <Text accessibilityRole="header">Novo Usuário</Text>

      <View style={styles.field}>
        <Text>Nome Completo</Text>
        <TextInput
          editable={!isSaving}
          style={styles.input}
          accessibilityLabel="Nome completo"
          placeholder="Digite o nome completo..."
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.field}>
        <Text>Data de nascimento</Text>
        <TextInput
          editable={!isSaving}
          style={styles.input}
          accessibilityLabel="Data de nascimento"
          placeholder="DD/MM/AAAA"
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
              disabled={isSaving}
              key={accessType.value}
              accessibilityRole="radio"
              accessibilityLabel={accessType.label}
              accessibilityState={{ checked: role === accessType.value, disabled: isSaving }}
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
          editable={!isSaving}
          style={styles.input}
          accessibilityLabel="Matrícula"
          placeholder="Digite a matrícula..."
          value={registration}
          onChangeText={setRegistration}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.field}>
        <Text>Senha</Text>
        <TextInput
          editable={!isSaving}
          style={styles.input}
          accessibilityLabel="Senha"
          placeholder="Digite a senha..."
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
          editable={!isSaving}
          style={styles.input}
          accessibilityLabel="Confirme sua senha"
          placeholder="Repita a senha..."
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {message ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite">{message}</Text> : null}
      <Button title={isSaving ? 'Enviando...' : 'Enviar'} onPress={handleSubmit} disabled={isSaving} />

      <View style={styles.footer}>
        <Footer />
      </View>
    </ScrollView>
  );
}
