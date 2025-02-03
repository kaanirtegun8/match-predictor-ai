import { useSubscription } from "@/contexts/SubscriptionContext";

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
}

export const usePremiumFeatures = () => {
  const { isSubscribed } = useSubscription();

  const features: PremiumFeature[] = [
    {
      id: 'advanced_analysis',
      name: 'Advanced Match Analysis',
      description: 'Get detailed AI-powered analysis of matches with historical data and predictions',
      isAvailable: isSubscribed,
    },
    {
      id: 'head_to_head',
      name: 'Head-to-Head Statistics',
      description: 'View comprehensive head-to-head statistics and historical match data',
      isAvailable: isSubscribed,
    },
    {
      id: 'player_stats',
      name: 'Player Statistics',
      description: 'Access detailed player statistics and performance metrics',
      isAvailable: isSubscribed,
    },
    {
      id: 'live_alerts',
      name: 'Live Match Alerts',
      description: 'Receive real-time notifications for goals, cards, and key events',
      isAvailable: isSubscribed,
    },
    {
      id: 'custom_predictions',
      name: 'Custom Predictions',
      description: 'Create and save your own match predictions with AI assistance',
      isAvailable: isSubscribed,
    },
  ];

  const getFeature = (featureId: string): PremiumFeature | undefined => {
    return features.find(feature => feature.id === featureId);
  };

  const isFeatureAvailable = (featureId: string): boolean => {
    return getFeature(featureId)?.isAvailable ?? false;
  };

  return {
    features,
    getFeature,
    isFeatureAvailable,
    isSubscribed,
  };
}; 