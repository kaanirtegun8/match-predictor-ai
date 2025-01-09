import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface AuthInputProps extends TextInputProps {
  // Add any additional props here
}

export function AuthInput({ style, ...props }: AuthInputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#666"
      autoCapitalize="none"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    fontSize: 16,
  },
}); 