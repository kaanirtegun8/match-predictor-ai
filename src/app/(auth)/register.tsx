import { View, Text, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import { AuthInput, AuthButton, GoogleSignInButton, FacebookSignInButton, AuthHeader } from '@/components/auth';
import { Colors } from '@/constants/Colors';

export default function RegisterScreen() {
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