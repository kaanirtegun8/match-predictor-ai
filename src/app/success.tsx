import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed/ThemedText';
import { ThemedView } from '@/components/themed/ThemedView';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import LottieView from 'lottie-react-native';
import { useLoading } from '@/contexts/LoadingContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

export default function SuccessScreen() {
  const { colors } = useTheme();
  const { showLoading, hideLoading } = useLoading();
  const { checkStatus } = useSubscription();

  const handleExplore = async () => {
    try {
      showLoading();
      // Refresh subscription status
      await checkStatus();
      
      // Navigate back to bulletin
      router.back();
      router.back();
      router.push('/(tabs)/bulletin');
    } catch (error) {
      console.error('Error refreshing subscription status:', error);
    } finally {
      hideLoading();
    }
  };

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
          style={[styles.exploreButton, { backgroundColor: colors.primary }]}
          onPress={handleExplore}>
          <ThemedText style={[styles.exploreText, { color: colors.background }]}>
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
  exploreButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  exploreText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 