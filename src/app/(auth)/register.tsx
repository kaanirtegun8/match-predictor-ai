import { View, Text, StyleSheet, Platform, Alert, Dimensions, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { AuthInput, AuthButton, GoogleSignInButton, FacebookSignInButton, AuthHeader } from '@/components/auth';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import * as AppleAuthentication from 'expo-apple-authentication';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isIPad = Platform.OS === 'ios' && SCREEN_WIDTH >= 768;

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithApple } = useAuth();
  const { t } = useTranslation();

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert(t('common.error'), t('auth.fillAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordsNoMatch'));
      return;
    }

    try {
      setLoading(true);
      const result = await signUp(email, password, fullName);
      if (!result.success) {
        Alert.alert(t('common.error'), result.error || t('auth.signUpFailed'));
      }
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      if (credential) {
        const { identityToken } = credential;
        if (identityToken) {
          const result = await signInWithApple(identityToken);
          if (!result.success) {
            Alert.alert(t('common.error'), result.error || t('auth.signInFailed'));
          }
        }
      }
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        // Handle user cancellation
      } else {
        Alert.alert(t('common.error'), error.message);
      }
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <AuthHeader 
          title={t('auth.createAccount')}
          subtitle={t('auth.createAccountSubtitle')}
        />

        <View style={styles.inputContainer}>
          <AuthInput
            placeholder={t('auth.fullName')}
            autoCapitalize="words"
            value={fullName}
            onChangeText={setFullName}
          />
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
          <AuthInput
            placeholder={t('auth.confirmPassword')}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <AuthButton
          title={t('auth.signUp')}
          onPress={handleRegister}
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
          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={isIPad ? 24 : 10}
              style={styles.appleButton}
              onPress={handleAppleSignIn}
            />
          )}
        </View>

        <Link href={{ pathname: '/(auth)/login' }} style={styles.link}>
          <Text style={styles.linkText}>{t('auth.haveAccount')}</Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
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
    gap: isIPad ? 16 : 10,
    marginBottom: isIPad ? 24 : 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: isIPad ? 24 : 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    color: Colors.light.text,
    paddingHorizontal: isIPad ? 16 : 12,
    fontSize: isIPad ? 18 : 13,
  },
  socialButtonsContainer: {
    gap: isIPad ? 16 : 8,
  },
  socialButtonSpacer: {
    height: isIPad ? 16 : 4,
  },
  link: {
    marginTop: isIPad ? 24 : 16,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.light.link,
    fontSize: isIPad ? 18 : 14,
  },
  appleButton: {
    width: '100%',
    height: isIPad ? 64 : 50,
  },
}); 