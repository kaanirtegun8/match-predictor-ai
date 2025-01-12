import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
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

  // Initialize RevenueCat
  useEffect(() => {
    const init = async () => {
      try {
        await initializeRevenueCat();
        await loadPackages();
        await checkStatus();
      } catch (error) {
        console.error('Failed to initialize subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

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
    } catch (error) {
      console.error('Failed to check status:', error);
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

  return {
    isLoading,
    packages,
    isSubscribed,
    customerInfo,
    purchase: handlePurchase,
    restore: handleRestore,
    checkStatus,
  };
}; 