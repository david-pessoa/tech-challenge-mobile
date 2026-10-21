import { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { useUser } from '../../context/AuthContext';
import type { Role } from '../../types/Roles';
import Footer from '../../components/Footer';
import EyeIcon from '../../../assets/icons/eye.svg';
import EyeOffIcon from '../../../assets/icons/eyeOff.svg';
import { createUser } from '../../services/user.service';
import { styles } from './styles';
import { theme } from '../../styles/Theme';

const accessTypes: { label: string; value: Role }[] = [
  { label: 'Aluno', value: 'ALUNO' },
  { label: 'Professor', value: 'PROFESSOR' },
  { label: 'Administrador', value: 'ADMIN' },
];

export default function UserRegister() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fontsLoaded, fontError] = useFonts({
    Poppins: require('../../../assets/fonts/Poppins-Regular.ttf'),
    PoppinsMedium: require('../../../assets/fonts/Poppins-Medium.ttf'),
    PoppinsSemiBold: require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    ...Ionicons.font,
  });
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [role, setRole] = useState<Role>();
  const [registration, setRegistration] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAccessTypes, setShowAccessTypes] = useState(false);
  const [focusedField, setFocusedField] = useState<string>();
  const canRegister = user?.role === 'ADMIN' || user?.role === 'PROFESSOR';
  const isProfessor = user?.role === 'PROFESSOR';
  const selectedRole = isProfessor ? 'ALUNO' : role;
  const availableAccessTypes = isProfessor
    ? accessTypes.filter(accessType => accessType.value === 'ALUNO')
    : accessTypes;


  async function handleSubmit() {
    if (isLoading || !canRegister || isSaving) return;
    setMessage('');
    setIsSuccess(false);

    if (!name.trim()) {
      setMessage('Informe o nome completo.');
      return;
    }

    if (!registration.trim()) {
      setMessage('Informe a matrícula.');
      return;
    }

    if (!selectedRole) {
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
    data.append('role', selectedRole);
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
      setIsSuccess(true);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setMessage('Usuário cadastrado com sucesso!');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível cadastrar o usuário.');
    } finally {
      setIsSaving(false);
    }
  }


  if (isLoading || (!fontsLoaded && !fontError)) {
    return <ActivityIndicator style={styles.loading} color={theme.colors.primary} accessibilityLabel="Carregando sessão" />;
  }
  if (!user) return <Redirect href="/login" />;
  if (!canRegister) return <Redirect href="/home" />;
  if (fontError) return <Text>Não foi possível carregar a tela de cadastro.</Text>;

  const profileLabel = isProfessor ? 'Professor' : 'Admin';
  const selectedRoleLabel = accessTypes.find(accessType => accessType.value === selectedRole)?.label ?? 'Selecione o tipo de acesso...';

  function goHome() {
    router.replace('/home');
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 16 }]}>
          <View style={[styles.header, isProfessor ? styles.professorHeader : styles.adminHeader]}>
            <View style={styles.headerGroup}>
              <Image source={require('../../../assets/images/logoEdify.png')} style={styles.logo} accessibilityLabel="Edify" />
              <Text style={styles.headerText}>Edify {isProfessor ? 'Professores' : 'Administradores'}</Text>
            </View>
            <View style={styles.headerGroup}>
              <View style={[styles.profileDot, isProfessor ? styles.professorDot : styles.adminDot]} />
              <Text style={styles.profileText}>{profileLabel}</Text>
            </View>
          </View>

          <View style={styles.form}>
            <Pressable onPress={goHome} disabled={isSaving} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Voltar à tela de início">
              <Ionicons name="arrow-back" size={18} color={theme.colors.backIcon} />
              <Text style={styles.backText}>Voltar à tela de início</Text>
            </Pressable>
            <View style={styles.titleRow}>
              <Text style={styles.title} accessibilityRole="header">Novo Usuário</Text>
              <Image source={require('../../../assets/images/red-doodle.png')} style={styles.decoration} resizeMode="contain" />
            </View>

            <View style={styles.fields}>
              <View style={styles.field}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                  editable={!isSaving}
                  style={[styles.input, focusedField === 'name' && styles.inputFocused]}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(undefined)}
                  placeholderTextColor={theme.colors.fieldPlaceholder}
                  accessibilityLabel="Nome completo"
                  placeholder="Digite o nome completo..."
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Data de nascimento</Text>
                <TextInput
                  editable={!isSaving}
                  style={[styles.input, focusedField === 'birthDate' && styles.inputFocused]}
                  onFocus={() => setFocusedField('birthDate')}
                  onBlur={() => setFocusedField(undefined)}
                  placeholderTextColor={theme.colors.fieldPlaceholder}
                  accessibilityLabel="Data de nascimento"
                  placeholder="DD/MM/AAAA"
                  value={birthDate}
                  onChangeText={setBirthDate}
                  keyboardType="numbers-and-punctuation"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Selecione o tipo de acesso:</Text>
                <Pressable
                  style={[styles.input, styles.select, isProfessor && styles.disabled]}
                  accessibilityRole="button"
                  accessibilityLabel="Tipo de acesso"
                  accessibilityValue={{ text: selectedRoleLabel }}
                  accessibilityState={{ disabled: isSaving || isProfessor, expanded: showAccessTypes }}
                  disabled={isSaving || isProfessor}
                  onPress={() => setShowAccessTypes(true)}
                >
                  <Text style={styles.selectText}>{selectedRoleLabel}</Text>
                  {!isProfessor && <Ionicons name="chevron-down" size={16} color={theme.colors.fieldPlaceholder} />}
                </Pressable>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Matrícula</Text>
                <TextInput
                  editable={!isSaving}
                  style={[styles.input, focusedField === 'registration' && styles.inputFocused]}
                  onFocus={() => setFocusedField('registration')}
                  onBlur={() => setFocusedField(undefined)}
                  placeholderTextColor={theme.colors.fieldPlaceholder}
                  accessibilityLabel="Matrícula"
                  placeholder="Digite a matrícula..."
                  value={registration}
                  onChangeText={setRegistration}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Senha</Text>
                <View style={[styles.passwordField, focusedField === 'password' && styles.inputFocused]}>
                  <TextInput
                    editable={!isSaving}
                    style={styles.passwordInput}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(undefined)}
                    placeholderTextColor={theme.colors.fieldPlaceholder}
                    accessibilityLabel="Senha"
                    placeholder="Digite a senha..."
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable style={styles.eyeButton} disabled={isSaving} onPress={() => setShowPassword(!showPassword)} accessibilityRole="button" accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </Pressable>
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Confirme sua senha</Text>
                <View style={[styles.passwordField, focusedField === 'confirmPassword' && styles.inputFocused]}>
                  <TextInput
                    editable={!isSaving}
                    style={styles.passwordInput}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(undefined)}
                    placeholderTextColor={theme.colors.fieldPlaceholder}
                    accessibilityLabel="Confirme sua senha"
                    placeholder="Repita a senha..."
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable style={styles.eyeButton} disabled={isSaving} onPress={() => setShowConfirmPassword(!showConfirmPassword)} accessibilityRole="button" accessibilityLabel={showConfirmPassword ? 'Ocultar confirmação da senha' : 'Mostrar confirmação da senha'}>
                    {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </Pressable>
                </View>
              </View>
            </View>

            {message ? <Text style={[styles.message, isSuccess ? styles.successMessage : styles.errorMessage]} accessibilityRole="alert" accessibilityLiveRegion="polite">{message}</Text> : null}
            <View style={styles.actions}>
              <Pressable style={[styles.button, styles.cancelButton, isSaving && styles.disabled]} onPress={goHome} disabled={isSaving} accessibilityRole="button" accessibilityLabel="Cancelar">
                <Text style={[styles.buttonText, styles.cancelText]}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.submitButton, isSaving && styles.disabled]} onPress={handleSubmit} disabled={isSaving} accessibilityRole="button" accessibilityLabel="Enviar" accessibilityState={{ disabled: isSaving, busy: isSaving }}>
                {isSaving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={[styles.buttonText, styles.submitText]}>Enviar</Text>}
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}><Footer /></View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showAccessTypes && !isProfessor} transparent animationType="fade" onRequestClose={() => setShowAccessTypes(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowAccessTypes(false)} accessibilityRole="button" accessibilityLabel="Fechar seleção de perfil">
          <View style={styles.options} accessibilityViewIsModal>
            <Text style={styles.label}>Tipo de acesso</Text>
            {availableAccessTypes.map(accessType => (
              <Pressable
                key={accessType.value}
                style={[styles.option, selectedRole === accessType.value && styles.optionSelected]}
                accessibilityRole="radio"
                accessibilityLabel={accessType.label}
                accessibilityState={{ checked: selectedRole === accessType.value }}
                onPress={() => { setRole(accessType.value); setShowAccessTypes(false); }}
              >
                <Text style={styles.optionText}>{accessType.label}</Text>
                {selectedRole === accessType.value && <Ionicons name="checkmark" size={18} color={theme.colors.primary} />}
              </Pressable>
            ))}
            <Pressable style={styles.option} onPress={() => setShowAccessTypes(false)} accessibilityRole="button" accessibilityLabel="Fechar">
              <Text style={styles.optionText}>Fechar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
