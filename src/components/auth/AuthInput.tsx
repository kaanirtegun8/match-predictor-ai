import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';

interface AuthInputProps extends TextInputProps {
  error?: string;
}

export function AuthInput({ style, error, ...props }: AuthInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style
        ]}
        placeholderTextColor="#999"
        autoCapitalize="none"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff8f8',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
}); 