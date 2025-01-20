import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from './themed/ThemedText';
import { ThemedView } from './themed/ThemedView';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export const SubscriptionInfo = () => {
  const { isSubscribed, customerInfo } = useSubscriptionContext();
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const router = useRouter();

  const handleManageSubscription = () => {
    router.push('/premium');
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.inputBackground }]} 
      onPress={handleManageSubscription}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { 
          backgroundColor: colors.background,
          shadowColor: colors.text
        }]}>
          <FontAwesome
            name="star"
            size={24}
            color={isSubscribed ? '#FFD700' : colors.textSecondary}
          />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>
            {isSubscribed ? 'Premium Member' : 'Free Member'}
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isSubscribed
              ? 'You have access to all premium features'
              : 'Upgrade to unlock all features'}
          </ThemedText>
          {customerInfo?.latestExpirationDate && (
            <ThemedText style={[styles.expirationDate, { color: colors.textSecondary }]}>
              Next billing date:{' '}
              {new Date(customerInfo.latestExpirationDate).toLocaleDateString()}
            </ThemedText>
          )}
        </View>
        <FontAwesome name="chevron-right" size={16} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  expirationDate: {
    fontSize: 12,
  },
}); 