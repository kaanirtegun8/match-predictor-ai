import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed/ThemedText';
import { ThemedView } from '@/components/themed/ThemedView';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import LottieView from 'lottie-react-native';

export default function SuccessScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Success Animation */}
        <View style={styles.animationContainer}>
          <Ionicons name="checkmark-circle" size={120} color={colors.success} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <ThemedText style={styles.title}>Welcome to Premium!</ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            You now have access to all premium features. Enjoy advanced match predictions and analysis!
          </ThemedText>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => {
            // First close all modals
            router.back();
            // Then navigate to bulletin
            setTimeout(() => {
              router.replace('/(tabs)/bulletin');
            }, 100);
          }}>
          <ThemedText style={[styles.buttonText, { color: colors.buttonText }]}>
            Start Exploring
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  content: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 