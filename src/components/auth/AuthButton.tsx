import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

export interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'social';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isIPad = Platform.OS === 'ios' && SCREEN_WIDTH >= 768;

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
    padding: isIPad ? 20 : 15,
    borderRadius: isIPad ? 24 : 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isIPad ? 50 : 50,
  },
  buttonText: {
    fontSize: isIPad ? 24 : 16,
    fontWeight: '600',
  },
}); 