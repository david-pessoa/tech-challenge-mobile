import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { KeyboardArrowDown } from '@material-symbols-svg/react-native/icons/keyboard-arrow-down';
import { materias } from '../../types/Materias';
import { theme } from '../../styles/Theme';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Screen, Scroll } from '../../styles/GlobalStyles';
import { styles } from './styles';

export default function PostCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [showSubjects, setShowSubjects] = useState(false);
  const [content, setContent] = useState('');

  return (
    <Screen style={styles.screen} edges={['top', 'right', 'bottom', 'left']}>
      <Scroll contentContainerStyle={styles.content}>
        <Header />
        <View style={styles.main}>
          <Text style={styles.title} accessibilityRole="header">Nova aula</Text>
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                accessibilityLabel="Título"
                placeholder="Digite o título..."
                placeholderTextColor={theme.colors.fieldPlaceholder}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={styles.input}
                accessibilityLabel="Descrição"
                placeholder="Digite a descrição..."
                placeholderTextColor={theme.colors.fieldPlaceholder}
                value={description}
                onChangeText={setDescription}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Matéria</Text>
              <Pressable
                style={[styles.input, styles.select]}
                accessibilityRole="button"
                accessibilityLabel="Matéria"
                accessibilityValue={{ text: subject || 'Escolha a matéria' }}
                accessibilityState={{ expanded: showSubjects }}
                onPress={() => setShowSubjects(true)}
              >
                <Text style={[styles.selectText, !subject && styles.placeholder]}>{subject || 'Escolha a matéria'}</Text>
                <KeyboardArrowDown width={24} height={24} fill={theme.colors.fieldPlaceholder} />
              </Pressable>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Conteúdo</Text>
              <TextInput
                style={[styles.input, styles.contentInput]}
                accessibilityLabel="Conteúdo"
                placeholder="Digite o conteúdo..."
                placeholderTextColor={theme.colors.fieldPlaceholder}
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
              />
            </View>
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
    </Screen>
  );
}
