import { TextInput, StyleSheet, TextInputProps, Dimensions, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isIPad = Platform.OS === 'ios' && SCREEN_WIDTH >= 768;

export function AuthInput(props: TextInputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor={Colors.light.textSecondary}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: isIPad ? 24 : 10,
    padding: isIPad ? 24 : 15,
    fontSize: isIPad ? 24 : 16,
    color: Colors.light.text,
  },
}); 