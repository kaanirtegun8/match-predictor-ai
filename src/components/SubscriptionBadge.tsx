import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface SubscriptionBadgeProps {
  showLabel?: boolean;
}

export const SubscriptionBadge = ({ showLabel = true }: SubscriptionBadgeProps) => {
  const { isSubscribed } = useSubscription();
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/bulletin',
      params: { screen: 'subscription' }
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSubscribed ? styles.subscribedContainer : styles.freeContainer,
      ]}
      onPress={handlePress}
    >
      <FontAwesome
        name="star"
        size={16}
        color={isSubscribed ? '#FFD700' : '#666'}
      />
      {showLabel && (
        <Text
          style={[
            styles.text,
            isSubscribed ? styles.subscribedText : styles.freeText,
          ]}
        >
          {isSubscribed ? 'Premium' : 'Free'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  subscribedContainer: {
    backgroundColor: '#FFF7E6',
  },
  freeContainer: {
    backgroundColor: '#F5F5F5',
  },
  text: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  subscribedText: {
    color: '#FFB100',
  },
  freeText: {
    color: '#666',
  },
}); 