import { View, Text, StyleSheet, Platform, Alert, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { AuthInput, AuthButton, GoogleSignInButton, FacebookSignInButton, AuthHeader } from '@/components/auth';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isIPad = Platform.OS === 'ios' && SCREEN_WIDTH >= 768;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('auth.fillAllFields'));
      return;
    }

    try {
      setLoading(true);
      const result = await signIn(email, password);
      if (!result.success) {
        Alert.alert(t('common.error'), result.error || t('auth.signInFailed'));
      }
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader 
        title={t('auth.welcomeBack')}
        subtitle={t('auth.welcomeSubtitle')}
      />

      <View style={styles.inputContainer}>
        <AuthInput
          placeholder={t('auth.email')}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <AuthInput
          placeholder={t('auth.password')}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <AuthButton
        title={t('auth.signIn')}
        onPress={handleLogin}
        loading={loading}
      />

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>{t('common.or')}</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <GoogleSignInButton />
        <View style={styles.socialButtonSpacer} />
        {/* <FacebookSignInButton
          onPress={() => {
            // TODO: Implement Facebook Sign-In
          }}
        /> */}
      </View>

      <Link href={{ pathname: '/(auth)/register' }} style={styles.link}>
        <Text style={styles.linkText}>{t('auth.noAccount')}</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isIPad ? 32 : 20,
    paddingTop: Platform.select({
      ios: 50,
      android: 40,
    }),
    backgroundColor: Colors.light.background,
  },
  inputContainer: {
    gap: isIPad ? 20 : 10,
    marginBottom: isIPad ? 32 : 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: isIPad ? 32 : 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    color: Colors.light.text,
    paddingHorizontal: isIPad ? 32 : 12,
    fontSize: isIPad ? 32 : 13,
  },
  socialButtonsContainer: {
    gap: isIPad ? 16 : 8,
  },
  socialButtonSpacer: {
    height: isIPad ? 48 : 4,
  },
  link: {
    marginTop: isIPad ? 32 : 16,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.light.link,
    fontSize: isIPad ? 32 : 14,
  },
}); 