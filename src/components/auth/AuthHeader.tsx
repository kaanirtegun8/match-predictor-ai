import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { Colors } from '@/constants/Colors';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isIPad = Platform.OS === 'ios' && SCREEN_WIDTH >= 768;

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      {Platform.OS !== 'web' && (
        <LottieView
          source={require('@/assets/animations/soccer-animation.json')}
          autoPlay
          loop
          speed={0.7}
          style={styles.animation}
        />
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: isIPad ? 64 : 32,
  },
  animation: {
    width: width * 0.6,
    height: width * 0.3,
    marginBottom: isIPad ? 32 : 16,
  },
  title: {
    fontSize: isIPad ? 48 : 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: isIPad ? 16 : 8,
  },
  subtitle: {
    fontSize: isIPad ? 24 : 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    paddingHorizontal: isIPad ? 48 : 20,
    lineHeight: isIPad ? 32 : 20,
  },
}); 