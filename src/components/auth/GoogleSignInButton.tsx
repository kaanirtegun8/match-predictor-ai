import { TouchableOpacity, Text, StyleSheet, View, Animated, Pressable, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useRef, useCallback, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const googleLogo = `
<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
  <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
</svg>
`;

export function GoogleSignInButton() {
  const scale = useRef(new Animated.Value(1)).current;
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const { t } = useTranslation();

  const animateScale = useCallback((value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, []);

  const handlePress = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();
      if (!result.success) {
        // You might want to show an error toast here
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable 
      onPressIn={() => animateScale(0.97)}
      onPressOut={() => animateScale(1)}
      onPress={handlePress}
      disabled={isLoading}
    >
      <Animated.View style={[
        styles.button,
        { transform: [{ scale }] }
      ]}>
        <View style={styles.iconContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#4285F4" />
          ) : (
            <SvgXml xml={googleLogo} width={18} height={18} />
          )}
        </View>
        <View style={styles.separator} />
        <Text style={styles.text}>
          {isLoading ? t('auth.signingIn') : t('auth.signInWithGoogle')}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 2,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    height: 40,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  separator: {
    width: 1,
    height: 28,
    backgroundColor: '#ddd',
  },
  text: {
    flex: 1,
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginRight: 40, // To balance the icon width
  },
}); 