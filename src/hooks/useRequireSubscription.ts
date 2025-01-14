import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';

export const useRequireSubscription = () => {
  const { isSubscribed, isLoading } = useSubscriptionContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isSubscribed) {
      Alert.alert(
        'Premium Feature',
        'This feature requires a premium subscription.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => router.back(),
          },
          {
            text: 'Subscribe',
            onPress: () => {
              router.push({
                pathname: '/(tabs)/bulletin',
                params: { screen: 'subscription' }
              });
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [isLoading, isSubscribed]);

  return {
    isSubscribed,
    isLoading,
  };
}; 