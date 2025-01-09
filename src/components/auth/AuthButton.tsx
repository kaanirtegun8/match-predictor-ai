import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
}

export function AuthButton({ title, style, ...props }: AuthButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2f95dc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 