import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed/ThemedText';
import { ThemedView } from '@/components/themed/ThemedView';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PurchasesPackage } from 'react-native-purchases';
import { useTranslation } from 'react-i18next';

export default function PremiumScreen() {
  const { colors } = useTheme();
  const { packages, purchase, restore, isLoading, checkStatus } = useSubscription();
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // Auto-select weekly package
  useEffect(() => {
    if (packages && packages.length > 0) {
      const weeklyPackage = packages.find(pkg => 
        pkg.product.identifier.toLowerCase().includes('weekly')
      );
      if (weeklyPackage) {
        setSelectedPackage(weeklyPackage);
      }
    }
  }, [packages]);

  const handleContinue = async () => {
    if (!selectedPackage) return;
    setLoading(true);
    try {
      const purchaseResult = await purchase(selectedPackage);
      if (purchaseResult) {
        await checkStatus();
        router.push('/success');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert(
        t('common.error'),
        t('premium.purchaseError'),
        [{ text: t('premium.ok') }]
      );
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
        t('common.error'),
        t('premium.restoreError'),
        [{ text: t('premium.ok') }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Hero Section with Dark Overlay */}
        <View style={styles.heroContainer}>
          <Image 
            source={require('@/assets/images/download.jpeg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: colors.background }]} 
            onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <ThemedText style={[styles.title, styles.heroText]}>{t('premium.upgradeToPremium')}</ThemedText>
            <ThemedText style={[styles.subtitle, styles.heroText]}>
              {t('premium.unlockPotential')}
            </ThemedText>
          </View>
        </View>

        {/* Main Content */}
        <ThemedView style={styles.mainContent}>
          {/* Features Grid */}
          <View style={styles.featuresGrid}>
            <Feature 
              icon="analytics" 
              titleKey="premium.features.advancedAnalysis.title"
              color={colors.primary}
            />
            <Feature 
              icon="stats-chart" 
              titleKey="premium.features.historicalData.title"
              color={colors.success}
            />
            <Feature 
              icon="notifications" 
              titleKey="premium.features.smartAlerts.title"
              color={colors.warning}
            />
          </View>

          {/* Packages */}
          <View style={styles.packagesContainer}>
            <ThemedText style={styles.packagesTitle}>{t('premium.choosePlan')}</ThemedText>
            {isLoading ? (
              <ActivityIndicator color={colors.primary} style={styles.loader} />
            ) : (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.packagesGrid}>
                {packages?.map((pkg) => (
                  <TouchableOpacity
                    key={pkg.identifier}
                    style={[
                      styles.packageCard,
                      { 
                        backgroundColor: selectedPackage?.identifier === pkg.identifier ? colors.border : colors.background,
                        borderColor: selectedPackage?.identifier === pkg.identifier 
                          ? colors.primary 
                          : colors.border 
                      },
                    ]}
                    onPress={() => setSelectedPackage(pkg)}>
                    <ThemedText style={styles.packageTitle}>
                      {pkg.product.title}
                    </ThemedText>
                    {pkg.product.introPrice ? (
                      <>
                        <ThemedText style={[styles.packagePrice, { textDecorationLine: 'line-through', color: colors.textSecondary, fontSize: 16 }]}>
                          {pkg.product.priceString}
                        </ThemedText>
                        <ThemedText style={[styles.packagePrice, { color: colors.primary }]}>
                          {pkg.product.introPrice.priceString}
                        </ThemedText>
                      </>
                    ) : (
                      <ThemedText style={[styles.packagePrice, { color: colors.primary }]}>
                        {pkg.product.priceString}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
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
                {loading ? t('premium.processing') : (
                  selectedPackage?.product.introPrice ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="rocket" size={20} color={colors.error} style={{ marginRight: 8 }} />
                      <ThemedText style={[styles.continueText, { color: colors.buttonText }]}>
                        {t('premium.startFreeTrial')}
                      </ThemedText>
                    </View>
                  ) : t('premium.continue')
                )}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.restoreButton} 
              onPress={handleRestore}
              disabled={loading}>
              <ThemedText style={[styles.restoreText, { color: colors.textSecondary }]}>
                {t('premium.restorePurchases')}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

function Feature({ icon, titleKey, color }: { icon: string, titleKey: string, color: string }) { 
  const { colors } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useTranslation();

  const getDescription = () => {
    switch (titleKey) {
      case 'premium.features.advancedAnalysis.title':
        return t('premium.features.advancedAnalysis.description');
      case 'premium.features.historicalData.title':
        return t('premium.features.historicalData.description');
      case 'premium.features.smartAlerts.title':
        return t('premium.features.smartAlerts.description');
      default:
        return '';
    }
  };

  return (
    <View style={[styles.featureWrapper, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        style={[styles.featureItem, { backgroundColor: colors.border }]}
        onPress={() => setShowTooltip(true)}>
        <ThemedView style={[styles.featureIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={20} color={color} />
        </ThemedView>
        <ThemedText style={styles.featureTitle}>{t(titleKey)}</ThemedText>
      </TouchableOpacity>

      <Modal
        transparent
        visible={showTooltip}
        animationType="fade"
        onRequestClose={() => setShowTooltip(false)}>
        <TouchableOpacity 
          style={styles.tooltipOverlay}
          activeOpacity={1}
          onPress={() => setShowTooltip(false)}>
          <View style={[styles.tooltipContainer, { backgroundColor: colors.background }]}>
            <View style={{ borderBottomColor: colors.background }} />
            <ThemedText style={styles.tooltipText}>{getDescription()}</ThemedText>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  heroContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  heroContent: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  featureWrapper: {
    width: '31%',
  },
  featureItem: {
    height: 100,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  packagesContainer: {
    marginBottom: 24,
  },
  packagesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  packagesGrid: {
    paddingHorizontal: 4,
    gap: 12,
    flexDirection: 'row',
  },
  packageCard: {
    width: 160,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  packagePeriod: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomActions: {
    marginTop: 'auto',
  },
  continueButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
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
  loader: {
    marginVertical: 20,
  },
  heroText: {
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  tooltipOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipContainer: {
    margin: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: '80%',
  },
  tooltipArrow: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  tooltipText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});