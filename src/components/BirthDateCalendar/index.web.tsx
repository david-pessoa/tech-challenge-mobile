import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { CalendarMonth, ChevronLeft, ChevronRight } from '@material-symbols-svg/react-native';
import { theme } from '../../styles/Theme';
import { formatBirthDate, parseBirthDate } from './date';
import type { BirthDateCalendarProps } from './types';
import { styles } from './styles';

export default function BirthDateCalendar({ value, onChange, disabled }: BirthDateCalendarProps) {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [month, setMonth] = useState(new Date());
  const [choosingYear, setChoosingYear] = useState(false);
  const today = new Date();
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const canAdvance = year < today.getFullYear() || monthIndex < today.getMonth();
  const years = Array.from({ length: today.getFullYear() - Math.min(1900, year) + 1 }, (_, index) => today.getFullYear() - index);
  const weekCount = Math.ceil((firstWeekday + daysInMonth) / 7);

  return (
    <>
      <Pressable
        style={styles.button}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Selecionar data de nascimento no calendário"
        onPress={() => {
          const date = parseBirthDate(value);
          setSelectedDate(date);
          setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
          setChoosingYear(false);
          setVisible(true);
        }}
      >
        <CalendarMonth width={20} height={20} fill={theme.colors.uploadText} />
      </Pressable>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={[styles.dialog, styles.calendarDialog]} accessibilityViewIsModal>
            <Text style={styles.title}>Data de nascimento</Text>
            <View style={styles.monthNavigation}>
              <Pressable style={styles.monthButton} accessibilityRole="button" accessibilityLabel="Mês anterior" onPress={() => setMonth(new Date(year, monthIndex - 1, 1))}>
                <ChevronLeft width={24} height={24} fill={theme.colors.primary} />
              </Pressable>
              <Pressable style={styles.monthTitle} accessibilityRole="button" accessibilityLabel="Selecionar ano" onPress={() => setChoosingYear(!choosingYear)}>
                <Text style={styles.calendarText}>{month.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</Text>
              </Pressable>
              <Pressable style={[styles.monthButton, !canAdvance && styles.disabled]} disabled={!canAdvance} accessibilityRole="button" accessibilityLabel="Próximo mês" onPress={() => setMonth(new Date(year, monthIndex + 1, 1))}>
                <ChevronRight width={24} height={24} fill={theme.colors.primary} />
              </Pressable>
            </View>
            {choosingYear ? (
              <ScrollView style={styles.yearScroll}>
                <View style={styles.yearGrid}>
                  {years.map(option => (
                    <Pressable
                      key={option}
                      accessibilityRole="button"
                      accessibilityLabel={`Ano ${option}`}
                      style={[styles.yearButton, option === year && styles.selectedDay]}
                      onPress={() => {
                        const selectedMonth = option === today.getFullYear() ? Math.min(monthIndex, today.getMonth()) : monthIndex;
                        setMonth(new Date(option, selectedMonth, 1));
                        setChoosingYear(false);
                      }}
                    >
                      <Text style={[styles.calendarText, option === year && styles.selectedDayText]}>{option}</Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View>
                <View style={styles.weekRow}>
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => <Text key={index} style={styles.weekday}>{day}</Text>)}
                </View>
                {Array.from({ length: weekCount }, (_, week) => (
                  <View key={week} style={styles.weekRow}>
                    {Array.from({ length: 7 }, (_, weekday) => {
                      const day = week * 7 + weekday - firstWeekday + 1;
                      if (day < 1 || day > daysInMonth) return <View key={weekday} style={styles.day} />;
                      const date = new Date(year, monthIndex, day);
                      const future = date > today;
                      const selected = formatBirthDate(date) === formatBirthDate(selectedDate);
                      return (
                        <Pressable
                          key={weekday}
                          accessibilityRole="button"
                          accessibilityLabel={formatBirthDate(date)}
                          accessibilityState={{ selected, disabled: future }}
                          disabled={future}
                          style={[styles.day, selected && styles.selectedDay, future && styles.disabled]}
                          onPress={() => setSelectedDate(date)}
                        >
                          <Text style={[styles.calendarText, selected && styles.selectedDayText]}>{day}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ))}
              </View>
            )}
            <View style={styles.actions}>
              <Pressable style={styles.action} accessibilityRole="button" accessibilityLabel="Cancelar seleção da data" onPress={() => setVisible(false)}>
                <Text style={styles.actionText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.action} accessibilityRole="button" accessibilityLabel="Confirmar data de nascimento" onPress={() => { onChange(formatBirthDate(selectedDate)); setVisible(false); }}>
                <Text style={styles.actionText}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
