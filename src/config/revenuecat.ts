import Purchases, { PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat API keys
const API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY
};

export const initializeRevenueCat = async () => {
  try {
    const apiKey = Platform.select({
      ios: API_KEYS.ios,
      android: API_KEYS.android,
      default: API_KEYS.android,
    });

    if (!apiKey) {
      throw new Error('RevenueCat API key not found for platform');
    }

    await Purchases.configure({ apiKey });
    
    // Enable debug logs in development
    if (__DEV__) {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    }

  } catch (error: unknown) {
    console.error('Failed to initialize RevenueCat:', error);
  }
};

// Helper function to get available packages
export const getAvailablePackages = async (): Promise<PurchasesPackage[]> => {
  try {
    const offerings = await Purchases.getOfferings();
    
    if (!offerings.current) {
      console.log('No current offering found');
      return [];
    }
    
    return offerings.current?.availablePackages ?? [];
  } catch (error: unknown) {
    return [];
  }
};

// Helper function to purchase a package
export const purchasePackage = async (package_: PurchasesPackage): Promise<CustomerInfo> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(package_);
    return customerInfo;
  } catch (error: any) {
    if (!error.userCancelled) {
      console.error('Failed to purchase:', error);
    }
    throw error;
  }
};

// Helper function to check subscription status
export const checkSubscriptionStatus = async (): Promise<{ isActive: boolean; customerInfo: CustomerInfo | null }> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return {
      isActive: Object.values(customerInfo.activeSubscriptions).length > 0,
      customerInfo
    };
  } catch (error: unknown) {
    console.error('Failed to check subscription status:', error);
    return { isActive: false, customerInfo: null };
  }
};

// Helper function to restore purchases
export const restorePurchases = async (): Promise<CustomerInfo> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error: unknown) {
    console.error('Failed to restore purchases:', error);
    throw error;
  }
}; 