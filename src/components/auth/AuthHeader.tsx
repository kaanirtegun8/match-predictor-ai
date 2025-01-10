import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { Colors } from '@/constants/Colors';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

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
    marginBottom: 32,
  },
  animation: {
    width: width * 0.6,
    height: width * 0.3,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
}); 