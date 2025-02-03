import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText, ThemedView } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useStats } from '@/hooks/useStats';

const PREMIUM_FEATURES = [
  {
    icon: 'analytics-outline',
    titleKey: 'premium.features.unlimitedAnalysis.title',
    descriptionKey: 'premium.features.unlimitedAnalysis.description'
  },
  {
    icon: 'bar-chart-outline',
    titleKey: 'premium.features.detailedStats.title',
    descriptionKey: 'premium.features.detailedStats.description'
  },
  {
    icon: 'notifications-outline',
    titleKey: 'premium.features.matchAlerts.title',
    descriptionKey: 'premium.features.matchAlerts.description'
  }
];

export function SubscriptionInfo() {
  const { isSubscribed } = useSubscription();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { stats, loading } = useStats();

  return (
    <ThemedView style={styles.container}>
      {/* Current Plan */}
      <ThemedView style={styles.planInfo}>
        <ThemedView style={[
          styles.planBadge,
          { backgroundColor: colors.primary }
        ]}>
          <Ionicons 
            name={isSubscribed ? "star" : "star-outline"} 
            size={20} 
            color="#fff" 
          />
          <ThemedText style={styles.planText}>
            {isSubscribed ? t('settings.accountType.premium') : t('premium.freePlan')}
          </ThemedText>
        </ThemedView>
        
        {!isSubscribed && !loading && (
          <ThemedText style={[styles.limitText, { color: colors.textTertiary }]}>
            {t('premium.analysesRemaining')}{stats.remainingAnalyses} 
          </ThemedText>
        )}
      </ThemedView>

      {/* Features List */}
      <ThemedView style={styles.featuresList}>
        {PREMIUM_FEATURES.map((feature, index) => (
          <ThemedView key={index} style={styles.featureItem}>
            <ThemedView style={[
              styles.featureIcon,
              { backgroundColor: colors.primary }
            ]}>
              <Ionicons name={feature.icon as any} size={20} color="#fff" />
            </ThemedView>
            <ThemedView style={styles.featureInfo}>
              <ThemedText style={[styles.featureTitle, {color: colors.text}]}>
                {t(feature.titleKey)}
              </ThemedText>
              <ThemedText style={[styles.featureDescription, {color: colors.textTertiary}]}>
                {t(feature.descriptionKey)}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        ))}
      </ThemedView>

      {/* Action Button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: isSubscribed ? '#6b7280' : '#FFD700' }
        ]}
        onPress={() => router.push(isSubscribed ? '/subscription-details' : '/premium')}>
        <ThemedText style={[
          styles.actionButtonText,
          { color: isSubscribed ? '#fff' : '#1f2937' }
        ]}>
          {isSubscribed ? t('premium.subscribe') : t('premium.upgradeToPremium')}
        </ThemedText>
        <Ionicons 
          name="arrow-forward" 
          size={20} 
          color={isSubscribed ? '#fff' : '#1f2937'} 
        />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  planInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  planText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  limitText: {
    fontSize: 14,
    color: '#666',
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    color: '#1f2937',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
}); 