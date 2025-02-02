import { useState, useEffect, useCallback } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import { useAuth } from './useAuth';
import {
  initializeRevenueCat,
  getAvailablePackages,
  purchasePackage,
  checkSubscriptionStatus,
  restorePurchases,
} from '../config/revenuecat';
import { useTheme } from '@/contexts/ThemeContext';

export const useSubscription = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const { user } = useAuth();
  const { togglePremiumTheme, isPremiumTheme } = useTheme();
  // Initialize RevenueCat and check subscription status when user changes
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        
        await initializeRevenueCat();
        
        await loadPackages();
        
        if (user) {
          await checkStatus();
        } else {
          setIsSubscribed(false);
          setCustomerInfo(null);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [user]);

  // Load available packages
  const loadPackages = async () => {
    try {
      const availablePackages = await getAvailablePackages();
      setPackages(availablePackages);
    } catch (error) {
      console.error('Failed to load packages:', error);
    }
  };

  // Check subscription status
  const checkStatus = async () => {
    try {
      const { isActive, customerInfo: info } = await checkSubscriptionStatus();
      setIsSubscribed(isActive);
      setCustomerInfo(info);
      console.log('isActive:', isActive);
      console.log('customerInfo:', info);
      // toggle premium theme
      if (!isActive && isPremiumTheme) {
        togglePremiumTheme();
      }
      return { isActive, customerInfo: info };
    } catch (error) {
      console.error('[Subscription] Failed to check status:', error);
      throw error;
    }
  };

  // Handle purchase
  const handlePurchase = useCallback(async (package_: PurchasesPackage) => {
    try {
      setIsLoading(true);
      const info = await purchasePackage(package_);
      setCustomerInfo(info);
      setIsSubscribed(Object.values(info.entitlements.active).length > 0);
      return true;
    } catch (error: any) {
      if (!error.userCancelled) {
        Alert.alert('Error', 'Failed to complete purchase. Please try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle restore purchases
  const handleRestore = useCallback(async () => {
    try {
      setIsLoading(true);
      const info = await restorePurchases();
      console.log("info:", info);
      setCustomerInfo(info);
      const isActive = Object.values(info.entitlements.active).length > 0;
      setIsSubscribed(isActive);
      
      Alert.alert(
        'Restore Complete',
        isActive 
          ? 'Your subscription has been restored!'
          : 'No active subscriptions found.'
      );
      
      return isActive;
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCancelSubscription = useCallback(() => {
    // Unfortunately, you cannot directly cancel a subscription programmatically in
    // either App Store or Play Store. Instead, you must direct the user to the
    // subscriptions management page for their platform.
    
    if (Platform.OS === 'ios') {
      // This may open the subscriptions management page in iOS
      Linking.openURL('https://apps.apple.com/account/subscriptions');
    } else {
      // This should open the subscriptions management page in Android
      Linking.openURL('https://play.google.com/store/account/subscriptions');
    }
  }, []);

  return {
    isLoading,
    packages,
    isSubscribed,
    customerInfo,
    purchase: handlePurchase,
    restore: handleRestore,
    checkStatus,
    cancelSubscription: handleCancelSubscription,
  };
}; 