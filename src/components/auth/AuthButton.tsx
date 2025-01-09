import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function AuthButton({ 
  title, 
  style, 
  loading = false,
  variant = 'primary',
  disabled,
  ...props 
}: AuthButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
        style
      ]} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : Colors.primary} />
      ) : (
        <Text style={[
          styles.text,
          variant === 'secondary' && styles.textSecondary,
          disabled && styles.textDisabled,
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonDisabled: {
    backgroundColor: Colors.textTertiary,
    borderColor: Colors.textTertiary,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  textSecondary: {
    color: Colors.primary,
  },
  textDisabled: {
    color: Colors.background,
  },
}); 