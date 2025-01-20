import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

export interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'social';
}

export function AuthButton({ title, onPress, loading, variant = 'primary' }: AuthButtonProps) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <TouchableOpacity 
      style={[
        styles.button,
        { backgroundColor: variant === 'primary' ? colors.buttonBackground : colors.background },
        variant === 'social' && { borderWidth: 1, borderColor: colors.socialButtonBorder },
      ]} 
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.buttonText : colors.primary} />
      ) : (
        <Text style={[
          styles.buttonText,
          { color: variant === 'primary' ? colors.buttonText : colors.text }
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 