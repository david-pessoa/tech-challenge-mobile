import { useState } from 'react';
import { Keyboard, Modal, Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarMonth } from '@material-symbols-svg/react-native';
import { theme } from '../../styles/Theme';
import { formatBirthDate, parseBirthDate } from './date';
import type { BirthDateCalendarProps } from './types';
import { styles } from './styles';

export default function BirthDateCalendar({ value, onChange, disabled }: BirthDateCalendarProps) {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const picker = visible ? (
    <DateTimePicker
      value={selectedDate}
      mode="date"
      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      maximumDate={new Date()}
      themeVariant="light"
      textColor={theme.colors.text}
      onDismiss={() => setVisible(false)}
      onValueChange={(_, date) => {
        setSelectedDate(date);
        if (Platform.OS === 'android') {
          onChange(formatBirthDate(date));
          setVisible(false);
        }
      }}
    />
  ) : null;

  return (
    <>
      <Pressable
        style={styles.button}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Selecionar data de nascimento no calendário"
        onPress={() => {
          Keyboard.dismiss();
          setSelectedDate(parseBirthDate(value));
          setVisible(true);
        }}
      >
        <CalendarMonth width={20} height={20} fill={theme.colors.uploadText} />
      </Pressable>
      {Platform.OS === 'ios' ? (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.dialog} accessibilityViewIsModal>
              <Text style={styles.title}>Data de nascimento</Text>
              {picker}
              <View style={styles.actions}>
                <Pressable style={styles.action} onPress={() => setVisible(false)} accessibilityRole="button" accessibilityLabel="Cancelar seleção da data">
                  <Text style={styles.actionText}>Cancelar</Text>
                </Pressable>
                <Pressable style={styles.action} onPress={() => { onChange(formatBirthDate(selectedDate)); setVisible(false); }} accessibilityRole="button" accessibilityLabel="Confirmar data de nascimento">
                  <Text style={styles.actionText}>Confirmar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      ) : picker}
    </>
  );
}
