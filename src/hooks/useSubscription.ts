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

export const useSubscription = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const { user } = useAuth();

  // Initialize RevenueCat and check subscription status when user changes
  useEffect(() => {
    const init = async () => {
      try {
        console.log("[Subscription] Initializing...");
        console.log("[Subscription] User state:", user?.email || "No user");
        setIsLoading(true);
        
        await initializeRevenueCat();
        console.log("[Subscription] RevenueCat initialized");
        
        await loadPackages();
        console.log("[Subscription] Packages loaded");
        
        if (user) {
          console.log("[Subscription] Checking status for user:", user.email);
          await checkStatus();
        } else {
          console.log("[Subscription] No user, resetting subscription state");
          setIsSubscribed(false);
          setCustomerInfo(null);
        }
      } catch (error) {
        console.error('[Subscription] Failed to initialize:', error);
      } finally {
        setIsLoading(false);
        console.log("[Subscription] Initialization complete");
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
      console.log("[Subscription] Checking subscription status...");
      const { isActive, customerInfo: info } = await checkSubscriptionStatus();
      console.log("[Subscription] Status check result:", { isActive, hasCustomerInfo: !!info });
      setIsSubscribed(isActive);
      setCustomerInfo(info);
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