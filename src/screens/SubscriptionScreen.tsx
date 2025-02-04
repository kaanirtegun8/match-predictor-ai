import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { usePremiumFeatures } from '../hooks/usePremiumFeatures';
import { PurchasesPackage } from 'react-native-purchases';
import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isIPad = Platform.OS === 'ios' && SCREEN_WIDTH >= 768;

export const SubscriptionScreen = () => {
  const {
    isLoading,
    packages,
    isSubscribed,
    purchase,
    restore,
  } = useSubscription();

  const { features } = usePremiumFeatures();

  const handlePurchase = async (package_: PurchasesPackage) => {
    const success = await purchase(package_);
    if (success) {
      Alert.alert(
        'Success',
        'Thank you for subscribing! You now have access to all premium features.'
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Premium Features</Text>
        <Text style={styles.subtitle}>
          Unlock all features with a premium subscription
        </Text>
      </View>

      {/* Features List */}
      <View style={styles.featuresContainer}>
        {features.map((feature) => (
          <View key={feature.id} style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <FontAwesome
                name={feature.isAvailable ? 'check-circle' : 'circle-o'}
                size={isIPad ? 48 : 24}
                color={feature.isAvailable ? '#4CAF50' : '#666'}
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureName}>{feature.name}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {isSubscribed ? (
        <View style={styles.subscribedContainer}>
          <Text style={styles.subscribedText}>
            You are currently subscribed!
          </Text>
          <Text style={styles.subscribedSubText}>
            Enjoy all premium features
          </Text>
        </View>
      ) : (
        <View style={styles.packagesContainer}>
          {packages.map((package_) => (
            <TouchableOpacity
              key={package_.identifier}
              style={styles.packageCard}
              onPress={() => handlePurchase(package_)}
            >
              <Text style={styles.packageTitle}>{package_.product.title}</Text>
              <Text style={styles.packagePrice}>
                {package_.product.priceString}
              </Text>
              <Text style={styles.packageDescription}>
                {package_.product.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.restoreButton}
        onPress={restore}
      >
        <Text style={styles.restoreButtonText}>
          Restore Purchases
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: isIPad ? 32 : 20,
    alignItems: 'center',
  },
  title: {
    fontSize: isIPad ? 48 : 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: isIPad ? 24 : 16,
    color: '#666',
    textAlign: 'center',
  },
  featuresContainer: {
    padding: isIPad ? 32 : 20,
    backgroundColor: '#f8f9fa',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIcon: {
    marginRight: 15,
    paddingTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureName: {
    fontSize: isIPad ? 24 : 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: isIPad ? 24 : 16,
    color: '#666',
    lineHeight: isIPad ? 32 : 20,
  },
  packagesContainer: {
    padding: isIPad ? 32 : 20,
  },
  packageCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: isIPad ? 24 : 12,
    padding: isIPad ? 32 : 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  packageTitle: {
    fontSize: isIPad ? 32 : 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: isIPad ? 32 : 24,
    color: '#007AFF',
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: isIPad ? 24 : 14,
    color: '#666',
  },
  subscribedContainer: {
    padding: isIPad ? 32 : 20,
    alignItems: 'center',
  },
  subscribedText: {
    fontSize: isIPad ? 32 : 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  subscribedSubText: {
    fontSize: isIPad ? 24 : 16,
    color: '#666',
    textAlign: 'center',
  },
  restoreButton: {
    padding: isIPad ? 32 : 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  restoreButtonText: {
    color: '#007AFF',
    fontSize: isIPad ? 24 : 16,
  },
}); 