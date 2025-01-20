import React, { createContext, useContext, useState } from 'react';

export interface Offering {
  identifier: string;
  serverDescription: string;
  displayPrice: string;
  period: string;
}

interface SubscriptionContextType {
  isSubscribed: boolean;
  customerInfo: any;
  offerings: Offering[];
  currentOffering: Offering | null;
  purchasePackage: (offering: Offering) => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [offerings, setOfferings] = useState<Offering[]>([
    {
      identifier: 'monthly',
      serverDescription: 'Monthly',
      displayPrice: '$9.99',
      period: 'per month'
    },
    {
      identifier: 'yearly',
      serverDescription: 'Yearly',
      displayPrice: '$79.99',
      period: 'per year'
    }
  ]);
  const [currentOffering, setCurrentOffering] = useState<Offering | null>(null);

  const purchasePackage = async (offering: Offering) => {
    // TODO: Implement actual purchase logic
    console.log('Purchasing package:', offering);
  };

  const restorePurchases = async () => {
    // TODO: Implement restore purchases logic
    console.log('Restoring purchases');
  };

  return (
    <SubscriptionContext.Provider 
      value={{ 
        isSubscribed, 
        customerInfo,
        offerings,
        currentOffering,
        purchasePackage,
        restorePurchases
      }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
}; 