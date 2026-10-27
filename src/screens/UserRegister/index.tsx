import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { useUser } from '../../context/AuthContext';
import type { Role } from '../../types/Roles';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { createUser, getUserById } from '../../services/user.service';
import { buildApiImageUrl } from '../../utils/functions';
import { styles } from './styles';
import { theme } from '../../styles/Theme';
import { ArrowBack, Cancel, Check, Download, KeyboardArrowDown, Visibility, VisibilityOff } from '@material-symbols-svg/react-native';
import Header from '@/components/Header';

const accessTypes: { label: string; value: Role }[] = [
  { label: 'Aluno', value: 'ALUNO' },
  { label: 'Professor', value: 'PROFESSOR' },
  { label: 'Administrador', value: 'ADMIN' },
];

type FormField = 'name' | 'birthDate' | 'role' | 'registration' | 'password' | 'confirmPassword' | 'photo';

export default function UserRegister({ userId }: { userId?: string } = {}) {
  const isEditing = Boolean(userId);
  const [isLoadingUser, setIsLoadingUser] = useState(Boolean(userId));
  const [userLoadError, setUserLoadError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [existingPhoto, setExistingPhoto] = useState<string>();
  const { user, isLoading } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const photoSize = isTablet ? 144 : 88;
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
  const closeToast = useCallback(() => setMessage(''), []);
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


  const photoUri = photo?.uri ?? existingPhoto;
  const submitLabel = isEditing ? 'Salvar' : 'Enviar';
  const backLabel = isEditing ? 'Voltar à lista de usuários' : 'Voltar à tela de início';

  useEffect(() => {
    if (!userId || isLoading || !canRegister) return;
    let active = true;

    async function loadUser() {
      setIsLoadingUser(true);
      setUserLoadError('');
      try {
        const selectedUser = await getUserById(userId!);
        if (!active) return;
        if (isProfessor && selectedUser.role !== 'ALUNO') {
          setUserLoadError('Você só pode editar usuários alunos.');
          return;
        }
        setName(selectedUser.nome);
        setRegistration(selectedUser.matricula);
        setRole(selectedUser.role);
        const date = selectedUser.birthDate?.slice(0, 10).split('-');
        setBirthDate(date ? `${date[2]}/${date[1]}/${date[0]}` : '');
        setExistingPhoto(selectedUser.image ? buildApiImageUrl(selectedUser.image) : undefined);
        setPhoto(undefined);
        setPassword('');
        setConfirmPassword('');
        setErrors({});
      } catch (error) {
        if (active) setUserLoadError(error instanceof Error ? error.message : 'Não foi possível carregar o usuário.');
      } finally {
        if (active) setIsLoadingUser(false);
      }
    }

    loadUser();
    return () => { active = false; };
  }, [userId, isLoading, canRegister, isProfessor, loadAttempt]);

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
  }, [isLoading, isLoadingUser, userLoadError, canRegister, isSaving]);

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
    if (isEditing && !password && !confirmPassword) {
      setErrors(current => ({ ...current, password: undefined, confirmPassword: undefined }));
      return;
    }
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
    if (isLoading || !canRegister || isSaving || isEditing) return;
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
      }
      setMessage(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }


  if (isLoading) {
    return <ActivityIndicator style={styles.loading} color={theme.colors.primary} accessibilityLabel="Carregando sessão" />;
  }
  if (!user) return <Redirect href="/login" />;
  if (!canRegister) return <Redirect href="/home" />;

  if (isEditing && isLoadingUser) {
    return <ActivityIndicator style={styles.loading} color={theme.colors.primary} accessibilityLabel="Carregando usuário" />;
  }
  if (isEditing && userLoadError) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Header />
        <View style={styles.form}>
          <Text style={styles.fieldError} accessibilityRole="alert">{userLoadError}</Text>
          <Pressable style={styles.backButton} onPress={() => setLoadAttempt(value => value + 1)} accessibilityRole="button">
            <Text style={styles.backText}>Tentar novamente</Text>
          </Pressable>
          <Pressable style={styles.backButton} onPress={() => router.replace('/user-list')} accessibilityRole="button">
            <Text style={styles.backText}>Voltar à lista de usuários</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const selectedRoleLabel = accessTypes.find(accessType => accessType.value === selectedRole)?.label ?? 'Selecione o tipo de acesso...';

  function goHome() {
    router.replace(isEditing ? '/user-list' : '/home');
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 16 }]}>
          <Header />

          <View style={[styles.form, isTablet && styles.tabletForm]}>
            <Pressable onPress={goHome} disabled={isSaving} style={styles.backButton} accessibilityRole="button" accessibilityLabel={backLabel}>
              <ArrowBack size={18} color={theme.colors.backIcon} />
              <Text style={styles.backText}>{backLabel}</Text>
            </Pressable>
            <View style={[styles.titleRow, isTablet && styles.tabletTitleRow]}>
              <Text style={[styles.title, isTablet && styles.tabletTitle]} accessibilityRole="header">{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</Text>
              <Image source={require('../../../assets/images/red-doodle.png')} style={styles.decoration} resizeMode="contain" />
            </View>

            <View style={[styles.photoNameRow, isTablet && styles.tabletPhotoNameRow]}>
              <View style={isTablet ? styles.tabletPhotoField : undefined}>
                <View style={[styles.photoContainer, isTablet && styles.tabletPhotoContainer]}>
                  <Pressable
                    ref={photoPickerRef}
                    style={[styles.photoPicker, isTablet && styles.tabletPhotoPicker, isSaving && styles.disabled]}
                    onPress={selectPhoto}
                    disabled={isSaving}
                    accessibilityRole="button"
                    accessibilityLabel={photoUri ? 'Trocar foto do usuário' : 'Selecionar foto do usuário'}
                  >
                    <Svg width={photoSize} height={photoSize} viewBox="0 0 88 88" style={styles.photoBorder} pointerEvents="none">
                      <Circle cx={44} cy={44} r={43.5} fill="none" stroke={theme.colors.primary} strokeWidth={1} strokeDasharray="17 17.165" />
                    </Svg>
                    {photoUri ? (
                      <Image source={{ uri: photoUri }} style={[styles.photoPreview, isTablet && styles.tabletPhotoPreview]} resizeMode="cover" />
                    ) : (
                      <>
                        <Download width={isTablet ? 24 : 14} height={isTablet ? 24 : 14} color={theme.colors.primary} />
                        <Text style={[styles.photoHint, isTablet && styles.tabletPhotoHint]}>Clique para carregar{Platform.OS === 'web' ? '\nou\narraste e solte.' : '\nsua foto'}</Text>
                      </>
                    )}
                  </Pressable>
                  {photoUri && (
                    <Pressable
                      style={styles.removePhotoButton}
                      onPress={() => { setPhoto(undefined); setExistingPhoto(undefined); clearFieldError('photo'); }}
                      disabled={isSaving}
                      accessibilityRole="button"
                      accessibilityLabel="Remover foto do usuário"
                      hitSlop={8}
                    >
                      <Cancel width={20} height={20} />
                    </Pressable>
                  )}
                </View>

                {errors.photo && <Text style={[styles.fieldError, styles.photoError, isTablet && styles.tabletPhotoError]} accessibilityRole="alert" accessibilityLiveRegion="polite">{errors.photo}</Text>}
              </View>
              <View style={[styles.field, isTablet && styles.tabletNameField]}>
                <Text style={[styles.label, isTablet && styles.tabletLabel]}>Nome Completo <Text style={styles.required}>*</Text></Text>
                <TextInput
                  editable={!isSaving}
                  style={[styles.input, isTablet && styles.tabletInput, focusedField === 'name' && styles.inputFocused]}
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
            </View>

            <View style={[styles.fields, isTablet && styles.tabletFields]}>
              <View style={[styles.field, isTablet && styles.tabletField]}>
                <Text style={[styles.label, isTablet && styles.tabletLabel]}>Data de nascimento</Text>
                <TextInput
                  editable={!isSaving}
                  style={[styles.input, isTablet && styles.tabletInput, focusedField === 'birthDate' && styles.inputFocused]}
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

              <View style={[styles.field, isTablet && styles.tabletField]}>
                <Text style={[styles.label, isTablet && styles.tabletLabel]}>Selecione o tipo de acesso: <Text style={styles.required}>*</Text></Text>
                <Pressable
                  style={[styles.input, isTablet && styles.tabletControl, styles.select, isProfessor && styles.disabled]}
                  accessibilityRole="button"
                  accessibilityLabel="Tipo de acesso"
                  accessibilityValue={{ text: selectedRoleLabel }}
                  accessibilityState={{ disabled: isSaving || isProfessor, expanded: showAccessTypes }}
                  disabled={isSaving || isProfessor}
                  onPress={() => setShowAccessTypes(true)}
                >
                  <Text numberOfLines={1} style={[styles.selectText, isTablet && styles.tabletText]}>{selectedRoleLabel}</Text>
                  {!isProfessor && <KeyboardArrowDown size={16} color={theme.colors.fieldPlaceholder} />}
                </Pressable>
                {errors.role && <Text style={styles.fieldError} accessibilityRole="alert" accessibilityLiveRegion="polite">{errors.role}</Text>}
              </View>

              <View style={[styles.field, isTablet && styles.tabletFullField]}>
                <Text style={[styles.label, isTablet && styles.tabletLabel]}>Matrícula <Text style={styles.required}>*</Text></Text>
                <TextInput
                  editable={!isSaving}
                  style={[styles.input, isTablet && styles.tabletInput, focusedField === 'registration' && styles.inputFocused]}
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

              <View style={[styles.field, isTablet && styles.tabletField]}>
                <Text style={[styles.label, isTablet && styles.tabletLabel]}>Senha {!isEditing && <Text style={styles.required}>*</Text>}</Text>
                <View style={[styles.passwordField, isTablet && styles.tabletControl, focusedField === 'password' && styles.inputFocused]}>
                  <TextInput
                    editable={!isSaving}
                    style={[styles.passwordInput, isTablet && styles.tabletInput]}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => validatePasswords('password')}
                    placeholderTextColor={theme.colors.fieldPlaceholder}
                    accessibilityLabel="Senha"
                    placeholder={isEditing ? 'Digite uma nova senha...' : 'Digite a senha...'}
                    value={password}
                    onChangeText={value => { setPassword(value); clearFieldError('password'); }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable style={styles.eyeButton} disabled={isSaving} onPress={() => setShowPassword(!showPassword)} accessibilityRole="button" accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                    {showPassword ? <Visibility size={18} color={theme.colors.passwordIcon} /> : <VisibilityOff size={18} color={theme.colors.passwordIcon} />}
                  </Pressable>
                </View>
                {errors.password && <Text style={styles.fieldError} accessibilityRole="alert" accessibilityLiveRegion="polite">{errors.password}</Text>}
              </View>

              <View style={[styles.field, isTablet && styles.tabletField]}>
                <Text style={[styles.label, isTablet && styles.tabletLabel]}>Confirme sua senha {!isEditing && <Text style={styles.required}>*</Text>}</Text>
                <View style={[styles.passwordField, isTablet && styles.tabletControl, focusedField === 'confirmPassword' && styles.inputFocused]}>
                  <TextInput
                    editable={!isSaving}
                    style={[styles.passwordInput, isTablet && styles.tabletInput]}
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
                    {showConfirmPassword ? <Visibility size={18} color={theme.colors.passwordIcon} /> : <VisibilityOff size={18} color={theme.colors.passwordIcon} />}
                  </Pressable>
                </View>
                {errors.confirmPassword && <Text style={styles.fieldError} accessibilityRole="alert" accessibilityLiveRegion="polite">{errors.confirmPassword}</Text>}
              </View>
            </View>

            <View style={[styles.actions, isTablet && styles.tabletActions]}>
              <Pressable style={[styles.button, styles.cancelButton, isSaving && styles.disabled]} onPress={() => router.replace('/user-list')} disabled={isSaving} accessibilityRole="button" accessibilityLabel="Cancelar">
                <Text style={[styles.buttonText, styles.cancelText]}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.submitButton, (isSaving || isEditing) && styles.disabled]} onPress={handleSubmit} disabled={isSaving || isEditing} accessibilityRole="button" accessibilityLabel={submitLabel} accessibilityState={{ disabled: isSaving || isEditing, busy: isSaving }}>
                {isSaving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={[styles.buttonText, styles.submitText]}>{submitLabel}</Text>}
              </Pressable>
            </View>
          </View>

          <Footer />
        </ScrollView>
      </KeyboardAvoidingView>

      {message ? <Toast message={message} type={isSuccess ? 'success' : 'error'} onClose={closeToast} /> : null}

      <Modal visible={showAccessTypes && !isProfessor} transparent animationType="fade" onRequestClose={() => setShowAccessTypes(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowAccessTypes(false)} accessibilityRole="button" accessibilityLabel="Fechar seleção de perfil">
          <View style={styles.options} accessibilityViewIsModal>
            <Text style={[styles.label, isTablet && styles.tabletLabel]}>Tipo de acesso</Text>
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
                {selectedRole === accessType.value && <Check size={18} color={theme.colors.primary} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
