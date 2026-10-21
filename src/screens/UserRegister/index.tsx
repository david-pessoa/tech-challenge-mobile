import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { useUser } from '../../context/AuthContext';
import type { Role } from '../../types/Roles';
import Footer from '../../components/Footer';
import EyeIcon from '../../../assets/icons/eye.svg';
import DownloadIcon from '../../../assets/icons/download-rounded.svg';
import RemovePhotoIcon from '../../../assets/icons/remove-photo.svg';
import EyeOffIcon from '../../../assets/icons/eyeOff.svg';
import { createUser } from '../../services/user.service';
import { styles } from './styles';
import { theme } from '../../styles/Theme';

const accessTypes: { label: string; value: Role }[] = [
  { label: 'Aluno', value: 'ALUNO' },
  { label: 'Professor', value: 'PROFESSOR' },
  { label: 'Administrador', value: 'ADMIN' },
];

type FormField = 'name' | 'birthDate' | 'role' | 'registration' | 'password' | 'confirmPassword' | 'photo';

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
  const photoPickerRef = useRef<View>(null);
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset>();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [role, setRole] = useState<Role>();
  const [registration, setRegistration] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
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


  useEffect(() => {
    if (Platform.OS !== 'web' || !photoPickerRef.current) return;

    const element = photoPickerRef.current as unknown as HTMLElement;
    function preventDropNavigation(event: DragEvent) {
      event.preventDefault();
    }
    function handleDrop(event: DragEvent) {
      event.preventDefault();
      const file = event.dataTransfer?.files[0];
      if (isSaving || !file || !file.type.startsWith('image/')) return;

      setErrors(current => ({ ...current, photo: undefined }));
      setPhoto({ uri: URL.createObjectURL(file), width: 0, height: 0, file, fileName: file.name, mimeType: file.type });
    }
    element.addEventListener('dragover', preventDropNavigation);
    element.addEventListener('drop', handleDrop);
    return () => {
      element.removeEventListener('dragover', preventDropNavigation);
      element.removeEventListener('drop', handleDrop);
    };
  }, [fontsLoaded, isLoading, canRegister, isSaving]);

  useEffect(() => {
    return () => {
      if (Platform.OS === 'web' && photo?.uri.startsWith('blob:')) URL.revokeObjectURL(photo.uri);
    };
  }, [photo]);

  function clearFieldError(field: FormField) {
    setErrors(current => ({ ...current, [field]: undefined }));
  }

  function validatePasswords(field: 'password' | 'confirmPassword') {
    setFocusedField(undefined);
    setErrors(current => ({
      ...current,
      password: !password.trim() ? 'A senha é obrigatória.' : undefined,
      confirmPassword: field === 'confirmPassword' || confirmPassword
        ? !confirmPassword
          ? 'Confirme sua senha.'
          : password !== confirmPassword ? 'As senhas não coincidem.' : undefined
        : current.confirmPassword,
    }));
  }

  async function selectPhoto() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0]);
        clearFieldError('photo');
      }
    } catch {
      setIsSuccess(false);
      setErrors(current => ({ ...current, photo: 'Não foi possível selecionar a foto. Tente novamente.' }));
    }
  }

  async function handleSubmit() {
    if (isLoading || !canRegister || isSaving) return;
    setMessage('');
    setIsSuccess(false);

    const validationErrors: Partial<Record<FormField, string>> = {};
    if (!name.trim()) validationErrors.name = 'O nome completo é obrigatório.';
    if (!registration.trim()) validationErrors.registration = 'A matrícula é obrigatória.';
    if (!selectedRole) validationErrors.role = 'Selecione o tipo de acesso.';
    if (!password.trim()) validationErrors.password = 'A senha é obrigatória.';
    if (!confirmPassword) {
      validationErrors.confirmPassword = 'Confirme sua senha.';
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'As senhas não coincidem.';
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0 || !selectedRole) return;

    const data = new FormData();
    data.append('nome', name.trim());
    data.append('matricula', registration.trim());
    data.append('role', selectedRole);
    data.append('senha', password);

    if (birthDate.trim()) {
      const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(birthDate.trim());

      if (!match) {
        setErrors({ birthDate: 'Informe a data de nascimento no formato DD/MM/AAAA.' });
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
        setErrors({ birthDate: 'Informe uma data de nascimento válida.' });
        return;
      }

      if (date > new Date()) {
        setErrors({ birthDate: 'A data de nascimento não pode ser futura.' });
        return;
      }

      data.append('birthDate', formattedDate);
    }

    setIsSaving(true);

    try {
      if (photo) {
        if (photo.fileSize && photo.fileSize > 5 * 1024 * 1024) {
          setErrors({ photo: 'A foto deve ter no máximo 5 MB.' });
          return;
        }

        const type = photo.mimeType ?? 'image/jpeg';
        const fileName = photo.fileName ?? (type === 'image/png' ? 'foto.png' : 'foto.jpg');

        if (Platform.OS === 'web') {
          const file = photo.file ?? await (await fetch(photo.uri)).blob();
          data.append('image', file, fileName);
        } else {
          data.append('image', { uri: photo.uri, name: fileName, type } as unknown as Blob);
        }
      }

      await createUser(data);
      setPhoto(undefined);
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
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível cadastrar o usuário.';
      if (/matr[ií]cula.*(cadastrad|existe)/i.test(errorMessage)) {
        setErrors({ registration: errorMessage });
      } else {
        setMessage(errorMessage);
      }
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

            <View style={styles.photoContainer}>
              <Pressable
                ref={photoPickerRef}
                style={[styles.photoPicker, isSaving && styles.disabled]}
                onPress={selectPhoto}
                disabled={isSaving}
                accessibilityRole="button"
                accessibilityLabel={photo ? 'Trocar foto do usuário' : 'Selecionar foto do usuário'}
              >
                <Svg width={88} height={88} viewBox="0 0 88 88" style={styles.photoBorder} pointerEvents="none">
                  <Circle cx={44} cy={44} r={43.5} fill="none" stroke={theme.colors.primary} strokeWidth={1} strokeDasharray="17 17.165" />
                </Svg>
                {photo ? (
                  <Image source={{ uri: photo.uri }} style={styles.photoPreview} resizeMode="cover" />
                ) : (
                  <>
                    <DownloadIcon width={14} height={14} />
                    <Text style={styles.photoHint}>Clique para carregar{Platform.OS === 'web' ? '\nou\narraste e solte.' : '\nsua foto'}</Text>
                  </>
                )}
              </Pressable>
              {photo && (
                <Pressable
                  style={styles.removePhotoButton}
                  onPress={() => { setPhoto(undefined); clearFieldError('photo'); }}
                  disabled={isSaving}
                  accessibilityRole="button"
                  accessibilityLabel="Remover foto do usuário"
                  hitSlop={8}
                >
                  <RemovePhotoIcon width={20} height={20} />
                </Pressable>
              )}
            </View>

            {errors.photo && <Text style={[styles.fieldError, styles.photoError]} accessibilityRole="alert" accessibilityLiveRegion="polite">{errors.photo}</Text>}

            <View style={styles.fields}>
              <View style={styles.field}>
                <Text style={styles.label}>Nome Completo <Text style={styles.required}>*</Text></Text>
                <TextInput
                  editable={!isSaving}
                  style={[styles.input, focusedField === 'name' && styles.inputFocused]}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(undefined)}
                  placeholderTextColor={theme.colors.fieldPlaceholder}
                  accessibilityLabel="Nome completo"
                  placeholder="Digite o nome completo..."
                  value={name}
                  onChangeText={value => { setName(value); clearFieldError('name'); }}
                  autoCapitalize="words"
                />
                {errors.name && <Text style={styles.fieldError} accessibilityRole="alert" accessibilityLiveRegion="polite">{errors.name}</Text>}
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
                  onChangeText={value => { setBirthDate(value); clearFieldError('birthDate'); }}
                  keyboardType="numbers-and-punctuation"
                />
                {errors.birthDate && <Text style={styles.fieldError} accessibilityRole="alert" accessibilityLiveRegion="polite">{errors.birthDate}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Selecione o tipo de acesso: <Text style={styles.required}>*</Text></Text>
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
                {errors.role && <Text style={styles.fieldError} accessibilityRole="alert" accessibilityLiveRegion="polite">{errors.role}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Matrícula <Text style={styles.required}>*</Text></Text>
                <TextInput
                  editable={!isSaving}
                  style={[styles.input, focusedField === 'registration' && styles.inputFocused]}
                  onFocus={() => setFocusedField('registration')}
                  onBlur={() => setFocusedField(undefined)}
                  placeholderTextColor={theme.colors.fieldPlaceholder}
                  accessibilityLabel="Matrícula"
                  placeholder="Digite a matrícula..."
                  value={registration}
                  onChangeText={value => { setRegistration(value); clearFieldError('registration'); }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.registration && <Text style={styles.fieldError} accessibilityRole="alert" accessibilityLiveRegion="polite">{errors.registration}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Senha <Text style={styles.required}>*</Text></Text>
                <View style={[styles.passwordField, focusedField === 'password' && styles.inputFocused]}>
                  <TextInput
                    editable={!isSaving}
                    style={styles.passwordInput}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => validatePasswords('password')}
                    placeholderTextColor={theme.colors.fieldPlaceholder}
                    accessibilityLabel="Senha"
                    placeholder="Digite a senha..."
                    value={password}
                    onChangeText={value => { setPassword(value); clearFieldError('password'); }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable style={styles.eyeButton} disabled={isSaving} onPress={() => setShowPassword(!showPassword)} accessibilityRole="button" accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </Pressable>
                </View>
                {errors.password && <Text style={styles.fieldError} accessibilityRole="alert" accessibilityLiveRegion="polite">{errors.password}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Confirme sua senha <Text style={styles.required}>*</Text></Text>
                <View style={[styles.passwordField, focusedField === 'confirmPassword' && styles.inputFocused]}>
                  <TextInput
                    editable={!isSaving}
                    style={styles.passwordInput}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => validatePasswords('confirmPassword')}
                    placeholderTextColor={theme.colors.fieldPlaceholder}
                    accessibilityLabel="Confirme sua senha"
                    placeholder="Repita a senha..."
                    value={confirmPassword}
                    onChangeText={value => { setConfirmPassword(value); clearFieldError('confirmPassword'); }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable style={styles.eyeButton} disabled={isSaving} onPress={() => setShowConfirmPassword(!showConfirmPassword)} accessibilityRole="button" accessibilityLabel={showConfirmPassword ? 'Ocultar confirmação da senha' : 'Mostrar confirmação da senha'}>
                    {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </Pressable>
                </View>
                {errors.confirmPassword && <Text style={styles.fieldError} accessibilityRole="alert" accessibilityLiveRegion="polite">{errors.confirmPassword}</Text>}
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
                onPress={() => { setRole(accessType.value); clearFieldError('role'); setShowAccessTypes(false); }}
              >
                <Text style={styles.optionText}>{accessType.label}</Text>
                {selectedRole === accessType.value && <Ionicons name="checkmark" size={18} color={theme.colors.primary} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
