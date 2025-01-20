import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed/ThemedText';
import { ThemedView } from '@/components/themed/ThemedView';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { useSubscription } from '@/hooks/useSubscription';
import { useState } from 'react';
import { PurchasesPackage } from 'react-native-purchases';

export default function PremiumScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const { packages, purchase, restore, isLoading } = useSubscription();
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedPackage) return;
    setLoading(true);
    try {
      await purchase(selectedPackage);
      router.push('/success');
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const restored = await restore();
      if (restored) {
        router.back();
      }
    } catch (error: any) {
      
      Alert.alert(
        'Error',
        'An error occurred while restoring purchases. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.container} bounces={false}>
        {/* Close Button */}
        <TouchableOpacity 
          style={[styles.closeButton, { backgroundColor: colors.background }]} 
          onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>

        {/* Hero Image */}
        <Image 
          source={require('@/assets/images/download.jpeg')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Content */}
        <ThemedView style={styles.content}>
          <ThemedText style={styles.title}>Upgrade to Premium</ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Get access to all premium features and unlock the full potential of Match Predictor AI
          </ThemedText>

          {/* Features List */}
          <View style={styles.featuresList}>
            <Feature 
              icon="analytics" 
              title="Advanced Match Analysis"
              description="Get detailed AI-powered match predictions and analysis"
            />
            <Feature 
              icon="stats-chart" 
              title="Historical Data"
              description="Access comprehensive historical match data and statistics"
            />
            <Feature 
              icon="notifications" 
              title="Smart Notifications (Coming Soon)"
              description="Receive personalized alerts for high-probability matches"
            />
          </View>

          {/* Packages */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offeringsContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <View style={styles.skeletonWrapper}>
                  <View style={[styles.skeleton, { backgroundColor: colors.border }]} />
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <View style={[styles.skeleton, { backgroundColor: colors.border }]} />
                </View>
                <ActivityIndicator 
                  style={styles.loadingIndicator}
                  color={colors.primary} 
                />
              </View>
            ) : (
              packages?.map((pkg, index) => (
                <View key={pkg.identifier} style={styles.offeringWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.offering,
                      { 
                        backgroundColor: colors.inputBackground,
                        borderColor: selectedPackage?.identifier === pkg.identifier 
                          ? colors.primary 
                          : colors.border 
                      },
                    ]}
                    onPress={() => setSelectedPackage(pkg)}>
                    <ThemedText style={styles.offeringTitle}>
                      {pkg.product.title}
                    </ThemedText>
                    <ThemedText style={[styles.offeringPrice, { color: colors.primary }]}>
                      {pkg.product.priceString}
                    </ThemedText>
                    <ThemedText style={[styles.offeringPeriod, { color: colors.textSecondary }]}>
                      {pkg.product.description}
                    </ThemedText>
                  </TouchableOpacity>
                  {index < packages.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  )}
                </View>
              ))
            )}
          </ScrollView>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              { 
                backgroundColor: selectedPackage ? colors.primary : colors.inputBackground,
                borderWidth: selectedPackage ? 0 : 1,
                borderColor: colors.border,
              },
              loading && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={loading || !selectedPackage}>
            <ThemedText style={[
              styles.continueText, 
              { color: selectedPackage ? colors.buttonText : colors.textSecondary }
            ]}>
              {loading ? 'Processing...' : 'Continue'}
            </ThemedText>
          </TouchableOpacity>

          {/* Restore Purchases */}
          <TouchableOpacity 
            style={styles.restoreButton} 
            onPress={handleRestore}
            disabled={loading}>
            <ThemedText style={[styles.restoreText, { color: colors.textSecondary }]}>
              Restore Purchases
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

function Feature({ icon, title, description }: { icon: string, title: string, description: string }) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemedView style={styles.featureItem}>
      <ThemedView style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name={icon as any} size={24} color={colors.primary} />
      </ThemedView>
      <View style={styles.featureText}>
        <ThemedText style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={[styles.featureDescription, { color: colors.textSecondary }]}>
          {description}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  heroImage: {
    width: '100%',
    height: 300,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  featuresList: {
    gap: 24,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
  },
  offeringsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    paddingVertical: 16,
  },
  offeringWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offering: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    width: 150,
  },
  offeringTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  offeringPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  offeringPeriod: {
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: '80%',
    marginHorizontal: 16,
  },
  continueButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  restoreButton: {
    padding: 16,
    alignItems: 'center',
  },
  restoreText: {
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  skeletonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeleton: {
    width: 150,
    height: 120,
    borderRadius: 12,
    opacity: 0.3,
  },
  loadingIndicator: {
    position: 'absolute',
  },
});