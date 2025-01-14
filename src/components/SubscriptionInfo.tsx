import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from './themed/ThemedText';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';

export const SubscriptionInfo = () => {
  const { isSubscribed, customerInfo } = useSubscriptionContext();
  const router = useRouter();

  const handleManageSubscription = () => {
    router.push('/(tabs)/subscription');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleManageSubscription}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome
            name="star"
            size={24}
            color={isSubscribed ? '#FFD700' : '#666'}
          />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>
            {isSubscribed ? 'Premium Member' : 'Free Member'}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {isSubscribed
              ? 'You have access to all premium features'
              : 'Upgrade to unlock all features'}
          </ThemedText>
          {customerInfo?.latestExpirationDate && (
            <ThemedText style={styles.expirationDate}>
              Next billing date:{' '}
              {new Date(customerInfo.latestExpirationDate).toLocaleDateString()}
            </ThemedText>
          )}
        </View>
        <FontAwesome name="chevron-right" size={16} color="#666" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
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
    color: '#666',
    marginBottom: 4,
  },
  expirationDate: {
    fontSize: 12,
    color: '#666',
  },
}); 