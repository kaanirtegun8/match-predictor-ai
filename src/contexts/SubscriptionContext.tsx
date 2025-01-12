import React, { createContext, useContext, ReactNode } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

interface SubscriptionContextType {
  isLoading: boolean;
  isSubscribed: boolean;
  packages: PurchasesPackage[];
  customerInfo: CustomerInfo | null;
  purchase: (package_: PurchasesPackage) => Promise<boolean>;
  restore: () => Promise<boolean>;
  checkStatus: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const subscription = useSubscription();

  return (
    <SubscriptionContext.Provider value={subscription}>
      {children}
    </SubscriptionContext.Provider>
  );
}; 