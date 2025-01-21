import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from './themed/ThemedText';
import { ThemedView } from './themed/ThemedView';
import { useSubscription } from '@/hooks/useSubscription';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export const SubscriptionInfo = () => {
  const { isSubscribed, customerInfo, isLoading } = useSubscription();
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const router = useRouter();

  const handleManageSubscription = () => {
    if (isSubscribed) {
      router.push('/subscription-details');
    } else {
      router.push('/premium');
    }
  };

  if (isLoading) {
    return (
      <ThemedView 
        style={[
          styles.container, 
          { backgroundColor: colors.inputBackground }
        ]}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { 
            backgroundColor: colors.background,
            shadowColor: colors.text
          }]}>
            <View style={[styles.skeleton, { backgroundColor: colors.border }]} />
          </View>
          <View style={styles.textContainer}>
            <View style={[styles.skeleton, styles.titleSkeleton, { backgroundColor: colors.border }]} />
            <View style={[styles.skeleton, styles.subtitleSkeleton, { backgroundColor: colors.border }]} />
          </View>
        </View>
      </ThemedView>
    );
  }

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: isSubscribed ? colors.primary + '15' : colors.inputBackground,
          borderColor: isSubscribed ? colors.primary : 'transparent',
          borderWidth: isSubscribed ? 1 : 0,
        }
      ]} 
      onPress={handleManageSubscription}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { 
          backgroundColor: isSubscribed ? colors.primary + '20' : colors.background,
          shadowColor: colors.text
        }]}>
          <FontAwesome
            name="star"
            size={24}
            color={isSubscribed ? colors.primary : colors.textSecondary}
          />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={[
            styles.title,
            isSubscribed && { color: colors.primary }
          ]}>
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
        <FontAwesome 
          name="chevron-right" 
          size={16} 
          color={isSubscribed ? colors.primary : colors.textSecondary} 
        />
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
  skeleton: {
    borderRadius: 4,
    opacity: 0.3,
  },
  titleSkeleton: {
    height: 16,
    width: '40%',
    marginBottom: 8,
  },
  subtitleSkeleton: {
    height: 14,
    width: '60%',
  },
}); 