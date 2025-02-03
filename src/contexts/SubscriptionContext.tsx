import React, { createContext, useContext, useEffect } from 'react';
import { useSubscription as useSubscriptionHook } from '@/hooks/useSubscription';

const SubscriptionContext = createContext<ReturnType<typeof useSubscriptionHook> | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const subscription = useSubscriptionHook();

  return (
    <SubscriptionContext.Provider value={{ ...subscription, isSubscribed: subscription.isSubscribed }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
