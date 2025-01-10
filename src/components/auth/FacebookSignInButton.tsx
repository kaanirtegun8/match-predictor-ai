import { Text, StyleSheet, View, Animated, Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useRef, useCallback } from 'react';

const facebookLogo = `
<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 9.05A8 8 0 1 0 7.54 16.8V11.12H5.46V9.05H7.54V7.35C7.54 5.28 8.86 4.04 10.74 4.04C11.64 4.04 12.58 4.2 12.58 4.2V6.28H11.54C10.52 6.28 10.2 6.9 10.2 7.54V9.05H12.48L12.12 11.12H10.2V16.8A8 8 0 0 0 17 9.05Z" fill="#fff"/>
</svg>
`;

interface FacebookSignInButtonProps {
  onPress: () => void;
}

export function FacebookSignInButton({ onPress }: FacebookSignInButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateScale = useCallback((value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, []);

  return (
    <Pressable 
      onPressIn={() => animateScale(0.97)}
      onPressOut={() => animateScale(1)}
      onPress={onPress}
    >
      <Animated.View style={[
        styles.button,
        { transform: [{ scale }] }
      ]}>
        <View style={styles.iconContainer}>
          <SvgXml xml={facebookLogo} width={18} height={18} />
        </View>
        <View style={styles.separator} />
        <Text style={styles.text}>Sign in with Facebook</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1877F2', // Facebook blue
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
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  separator: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
  },
  text: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginRight: 40, // To balance the icon width
  },
}); 