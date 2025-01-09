import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { AuthInput, AuthButton } from '@/components/auth';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match Predictor AI</Text>
      
      <View style={styles.inputContainer}>
        <AuthInput
          placeholder="Email"
          keyboardType="email-address"
        />
        <AuthInput
          placeholder="Password"
          secureTextEntry
        />
      </View>

      <AuthButton
        title="Sign In"
        onPress={() => {
          // TODO: Implement login
        }}
      />

      <Link href={{ pathname: '/(auth)/register' }} style={styles.link}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    gap: 15,
    marginBottom: 30,
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#2f95dc',
    fontSize: 14,
  },
}); 