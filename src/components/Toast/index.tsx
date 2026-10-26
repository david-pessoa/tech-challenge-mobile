import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import { Close } from '@material-symbols-svg/react-native';

type ToastProps = {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timeout = setTimeout(onClose, 5000);
    return () => clearTimeout(timeout);
  }, [message, onClose]);

  return (
    <View style={[styles.container, { top: insets.top + 12 }]} pointerEvents="box-none">
      <View style={[styles.toast, type === 'success' ? styles.success : styles.error]}>
        <Text style={styles.message} accessibilityRole="alert" accessibilityLiveRegion="polite">{message}</Text>
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar notificação" style={styles.closeButton}>
          <Close style={styles.closeText} />
        </Pressable>
      </View>
    </View>
  );
}
