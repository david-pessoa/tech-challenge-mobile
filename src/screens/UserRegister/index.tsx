import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import type { Role } from '../../types/Roles';

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
    <ScrollView keyboardShouldPersistTaps="handled">
      <Text>Novo Usuário</Text>

      <Text>Nome Completo</Text>
      <TextInput
        accessibilityLabel="Nome completo"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <Text>Data de nascimento</Text>
      <TextInput
        accessibilityLabel="Data de nascimento"
        value={birthDate}
        onChangeText={setBirthDate}
        keyboardType="numbers-and-punctuation"
      />

      <Text>Tipo de acesso</Text>
      <View>
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

      <Text>Matrícula</Text>
      <TextInput
        accessibilityLabel="Matrícula"
        value={registration}
        onChangeText={setRegistration}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text>Senha</Text>
      <TextInput
        accessibilityLabel="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text>Confirme sua senha</Text>
      <TextInput
        accessibilityLabel="Confirme sua senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
    </ScrollView>
  );
}
