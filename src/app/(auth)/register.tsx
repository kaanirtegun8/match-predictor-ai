import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { AuthInput, AuthButton, GoogleSignInButton, FacebookSignInButton, AuthHeader } from '@/components/auth';
import { Colors } from '@/constants/Colors';
import { registerWithEmail } from '@/services/auth';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await registerWithEmail(email, password);
      router.replace('/(tabs)/bulletin');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader 
        title="Create Account"
        subtitle="Join us to get AI-powered match predictions"
      />

      <View style={styles.inputContainer}>
        <AuthInput
          placeholder="Full Name"
          autoCapitalize="words"
          value={fullName}
          onChangeText={setFullName}
        />
        <AuthInput
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <AuthInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <AuthInput
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <AuthButton
        title="Sign Up"
        onPress={handleRegister}
        loading={loading}
      />

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <GoogleSignInButton
          onPress={() => {
            // TODO: Implement Google Sign-In
          }}
        />
        <View style={styles.socialButtonSpacer} />
        <FacebookSignInButton
          onPress={() => {
            // TODO: Implement Facebook Sign-In
          }}
        />
      </View>

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
    paddingTop: Platform.select({
      ios: 50,
      android: 40,
    }),
    backgroundColor: Colors.background,
  },
  inputContainer: {
    gap: 10,
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textTertiary,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  socialButtonsContainer: {
    gap: 8,
  },
  socialButtonSpacer: {
    height: 4,
  },
  link: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.link,
    fontSize: 14,
  },
}); 