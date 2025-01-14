import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from './themed/ThemedText';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';

interface PremiumFeatureProps {
  featureId: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PremiumFeature = ({
  featureId,
  children,
  fallback,
}: PremiumFeatureProps) => {
  const { isFeatureAvailable, getFeature } = usePremiumFeatures();
  const router = useRouter();
  const feature = getFeature(featureId);

  if (isFeatureAvailable(featureId)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const handleUpgrade = () => {
    router.push({
      pathname: '/(tabs)/bulletin',
      params: { screen: 'subscription' }
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleUpgrade}>
      <View style={styles.content}>
        <FontAwesome name="lock" size={20} color="#666" style={styles.icon} />
        <View>
          <ThemedText style={styles.title}>{feature?.name}</ThemedText>
          <ThemedText style={styles.description}>
            Upgrade to Premium to unlock this feature
          </ThemedText>
        </View>
      </View>
      <FontAwesome name="chevron-right" size={16} color="#666" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
}); 