import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '@/constants/Colors';

export function AuthInput(props: TextInputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor={Colors.inputPlaceholder}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: Colors.inputText,
  },
}); 