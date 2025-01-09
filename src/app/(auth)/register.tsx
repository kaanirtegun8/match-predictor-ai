import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { AuthInput, AuthButton } from '@/components/auth';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <View style={styles.inputContainer}>
        <AuthInput
          placeholder="Full Name"
          autoCapitalize="words"
        />
        <AuthInput
          placeholder="Email"
          keyboardType="email-address"
        />
        <AuthInput
          placeholder="Password"
          secureTextEntry
        />
        <AuthInput
          placeholder="Confirm Password"
          secureTextEntry
        />
      </View>

      <AuthButton
        title="Sign Up"
        onPress={() => {
          // TODO: Implement registration
        }}
      />

      <Link href={{ pathname: '/(auth)/login' }} style={styles.link}>
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
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