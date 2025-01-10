import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';

export interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'social';
}

export function AuthButton({ title, onPress, loading, variant = 'primary' }: AuthButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        variant === 'social' && styles.socialButton,
      ]} 
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.buttonText : Colors.primary} />
      ) : (
        <Text style={[
          styles.buttonText,
          variant === 'social' && styles.socialButtonText
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.buttonBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  socialButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.socialButtonBorder,
  },
  buttonText: {
    color: Colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
  socialButtonText: {
    color: Colors.text,
  },
}); 