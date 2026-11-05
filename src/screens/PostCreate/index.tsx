import { useCallback, useEffect, useRef, useState, type ComponentRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowBack } from '@material-symbols-svg/react-native/icons/arrow-back';
import Svg, { Rect } from 'react-native-svg';
import { ActivityIndicator, Image, Modal, Platform, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Cancel } from '@material-symbols-svg/react-native/icons/cancel';
import { Download } from '@material-symbols-svg/react-native/icons/download';
import { KeyboardArrowDown } from '@material-symbols-svg/react-native/icons/keyboard-arrow-down';
import { materias } from '../../types/Materias';
import { theme } from '../../styles/Theme';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { useUser } from '../../context/AuthContext';
import { createPost } from '../../services/post.service';
import { Screen, Scroll } from '../../styles/GlobalStyles';
import { createStyles } from './styles';
import redDoodle from '../../../assets/images/red-doodle.png';

export default function PostCreate() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const styles = createStyles(width);
  const [focusedField, setFocusedField] = useState<string>();
  const photoPickerRef = useRef<ComponentRef<typeof Pressable>>(null);
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset>();
  const [photoError, setPhotoError] = useState('');
  const [photoBounds, setPhotoBounds] = useState({ width: 0, height: 0 });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [showSubjects, setShowSubjects] = useState(false);
  const [content, setContent] = useState('');
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' }>();
  const closeToast = useCallback(() => setNotification(undefined), []);

  async function handleSubmit() {
    if (savingRef.current || !user || !['ADMIN', 'PROFESSOR'].includes(user.role)) return;
    if (!title.trim() || !description.trim() || !subject || !content.trim()) {
      setNotification({ message: 'Preencha título, descrição, matéria e conteúdo.', type: 'error' });
      return;
    }
    savingRef.current = true;
    setIsSaving(true);
    setShowSubjects(false);
    setNotification(undefined);
    try {
      const data = new FormData();
      data.append('titulo', title.trim());
      data.append('descricao', description.trim());
      data.append('subjectName', subject);
      data.append('conteudo', content.trim());
      if (photo) {
        const type = photo.mimeType ?? 'image/jpeg';
        const fileName = photo.fileName ?? (type === 'image/png' ? 'foto.png' : 'foto.jpg');
        if (Platform.OS === 'web') {
          const file = photo.file ?? (await (await fetch(photo.uri)).blob());
          data.append('image', file, fileName);
        } else {
          data.append('image', { uri: photo.uri, name: fileName, type } as unknown as Blob);
        }
      }
      await createPost(data);
      setTitle('');
      setDescription('');
      setSubject('');
      setContent('');
      setPhoto(undefined);
      setPhotoError('');
      setNotification({ message: 'Aula criada com sucesso!', type: 'success' });
    } catch (error) {
      setNotification({ message: error instanceof Error ? error.message : 'Não foi possível criar a aula.', type: 'error' });
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }

  function updatePhoto(asset: ImagePicker.ImagePickerAsset) {
    if (savingRef.current) return;
    if (asset.mimeType && !asset.mimeType.startsWith('image/')) {
      setPhotoError('Selecione um arquivo de imagem.');
      return;
    }
    if ((asset.fileSize ?? asset.file?.size ?? 0) > 5 * 1024 * 1024) {
      setPhotoError('A foto deve ter no máximo 5 MB.');
      return;
    }
    setPhoto(asset);
    setPhotoError('');
  }

  async function selectPhoto() {
    if (savingRef.current) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (!result.canceled && result.assets[0]) updatePhoto(result.assets[0]);
    } catch {
      setPhotoError('Não foi possível selecionar a foto. Tente novamente.');
    }
  }

  useEffect(() => {
    if (Platform.OS !== 'web' || !photoPickerRef.current) return;
    const element = photoPickerRef.current as unknown as HTMLElement;
    function preventNavigation(event: DragEvent) {
      event.preventDefault();
    }
    function handleDrop(event: DragEvent) {
      event.preventDefault();
      if (savingRef.current) return;
      const file = event.dataTransfer?.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        setPhotoError('Selecione um arquivo de imagem.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError('A foto deve ter no máximo 5 MB.');
        return;
      }
      updatePhoto({ uri: URL.createObjectURL(file), width: 0, height: 0, file, fileName: file.name, mimeType: file.type, fileSize: file.size });
    }
    element.addEventListener('dragover', preventNavigation);
    element.addEventListener('drop', handleDrop);
    return () => {
      element.removeEventListener('dragover', preventNavigation);
      element.removeEventListener('drop', handleDrop);
    };
  }, []);

  useEffect(() => () => {
    if (Platform.OS === 'web' && photo?.uri.startsWith('blob:')) URL.revokeObjectURL(photo.uri);
  }, [photo]);

  return (
    <Screen style={styles.screen} edges={['top', 'right', 'bottom', 'left']}>
      <Scroll contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Header />
        <View style={styles.main}>
          <Pressable
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Voltar à tela de início"
            disabled={isSaving}
            onPress={() => router.replace('/home')}
          >
            <ArrowBack width={24} height={24} fill="#FFD600" />
            <Text style={styles.backText}>Voltar à tela de início</Text>
          </Pressable>
          <View style={styles.titleRow}>
            <Text style={styles.title} accessibilityRole="header">Nova aula</Text>
            <Image source={redDoodle} style={styles.decoration} resizeMode="contain" accessible={false} />
          </View>
          <View style={styles.form}>
            <View style={styles.field}>
              <View style={styles.photoContainer}>
                <Pressable
                  ref={photoPickerRef}
                  style={styles.photoPicker}
                  onLayout={event => {
                    const { width, height } = event.nativeEvent.layout;
                    setPhotoBounds({ width, height });
                  }}
                  onPress={selectPhoto}
                  disabled={isSaving}
                  accessibilityRole="button"
                  accessibilityLabel={photo ? 'Trocar foto da aula' : 'Selecionar foto da aula'}
                >
                  {photo ? (
                    <Image source={{ uri: photo.uri }} style={styles.photoPreview} resizeMode="cover" accessibilityLabel="Prévia da foto da aula" />
                  ) : (
                    <>
                      <Download width={20} height={20} fill="#DC9A9A" />
                      <Text style={styles.photoHint}>{Platform.OS === 'web' ? 'Clique para carregar ou\narraste e solte.' : 'Toque para selecionar\numa foto.'}</Text>
                    </>
                  )}
                  {photoBounds.width > 0 && (
                    <Svg width={photoBounds.width} height={photoBounds.height} style={styles.photoBorder} pointerEvents="none">
                      <Rect
                        x={0.5}
                        y={0.5}
                        width={photoBounds.width - 1}
                        height={photoBounds.height - 1}
                        rx={15}
                        fill="none"
                        stroke="#D34359"
                        strokeWidth={1}
                        strokeDasharray="21 21"
                      />
                    </Svg>
                  )}
                </Pressable>
                {photo && (
                  <Pressable disabled={isSaving} style={styles.removePhotoButton} accessibilityRole="button" accessibilityLabel="Remover foto da aula" onPress={() => { setPhoto(undefined); setPhotoError(''); }}>
                    <View style={styles.removePhotoIcon}>
                      <Cancel width={24} height={24} fill={theme.colors.primary} />
                    </View>
                  </Pressable>
                )}
              </View>
              {photoError ? <Text style={styles.photoError} accessibilityRole="alert" accessibilityLiveRegion="polite">{photoError}</Text> : null}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Título <Text style={styles.required}>*</Text></Text>
              <TextInput
                editable={!isSaving}
                style={[styles.input, focusedField === 'title' && styles.inputFocused]}
                accessibilityLabel="Título"
                placeholder="Digite o título..."
                placeholderTextColor={theme.colors.fieldPlaceholder}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(undefined)}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Descrição <Text style={styles.required}>*</Text></Text>
              <TextInput
                editable={!isSaving}
                style={[styles.input, focusedField === 'description' && styles.inputFocused]}
                accessibilityLabel="Descrição"
                placeholder="Digite a descrição..."
                placeholderTextColor={theme.colors.fieldPlaceholder}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(undefined)}
                value={description}
                onChangeText={setDescription}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Matéria <Text style={styles.required}>*</Text></Text>
              <Pressable
                style={[styles.input, styles.select, showSubjects && styles.inputFocused]}
                accessibilityRole="button"
                accessibilityLabel="Matéria"
                accessibilityValue={{ text: subject || 'Escolha a matéria' }}
                accessibilityState={{ expanded: showSubjects }}
                disabled={isSaving}
                onPress={() => setShowSubjects(true)}
              >
                <Text style={[styles.selectText, !subject && styles.placeholder]}>{subject || 'Escolha a matéria'}</Text>
                <KeyboardArrowDown width={24} height={24} fill={theme.colors.fieldPlaceholder} />
              </Pressable>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Conteúdo <Text style={styles.required}>*</Text></Text>
              <TextInput
                editable={!isSaving}
                style={[styles.input, styles.contentInput, focusedField === 'content' && styles.inputFocused]}
                accessibilityLabel="Conteúdo"
                placeholder="Digite o conteúdo..."
                placeholderTextColor={theme.colors.fieldPlaceholder}
                onFocus={() => setFocusedField('content')}
                onBlur={() => setFocusedField(undefined)}
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
          <View style={styles.actions}>
            <Pressable
              style={[styles.cancelButton, isSaving && styles.disabled]}
              accessibilityRole="button"
              accessibilityLabel="Cancelar criação da aula"
              disabled={isSaving}
              onPress={() => router.replace('/home')}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable style={[styles.submitButton, isSaving && styles.disabled]} accessibilityRole="button" accessibilityLabel="Enviar aula" accessibilityState={{ disabled: isSaving, busy: isSaving }} disabled={isSaving} onPress={handleSubmit}>
              {isSaving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitText}>Enviar</Text>}
            </Pressable>
          </View>
        </View>
        <Footer />
      </Scroll>
      <Modal visible={showSubjects} transparent animationType="fade" onRequestClose={() => setShowSubjects(false)}>
        <Pressable style={styles.optionsOverlay} onPress={() => setShowSubjects(false)} accessibilityRole="button" accessibilityLabel="Fechar seleção de matéria">
          <View style={styles.options} accessibilityViewIsModal>
            <Text style={styles.label}>Escolha a matéria</Text>
            <ScrollView>
              {Object.keys(materias).map(option => (
                <Pressable
                  key={option}
                  style={[styles.option, subject === option && styles.selectedOption]}
                  accessibilityRole="radio"
                  accessibilityLabel={option}
                  accessibilityState={{ checked: subject === option }}
                  onPress={() => {
                    setSubject(option);
                    setShowSubjects(false);
                  }}
                >
                  <Text style={styles.selectText}>{option}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
      {notification ? <Toast message={notification.message} type={notification.type} onClose={closeToast} /> : null}
    </Screen>
  );
}
