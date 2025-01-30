import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TutorialProvider as TutorialContextProvider } from '@/contexts/TutorialContext';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialTooltip } from './TutorialTooltip';

interface TutorialProviderProps {
  children: React.ReactNode;
}

export function TutorialProvider({ children }: TutorialProviderProps) {
  return (
    <TutorialContextProvider>
      <View style={styles.container}>
        {children}
        <TutorialOverlay />
        <TutorialTooltip />
      </View>
    </TutorialContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Re-export everything for easier imports
export * from '@/contexts/TutorialContext';
export { TutorialOverlay } from './TutorialOverlay';
export { TutorialTooltip } from './TutorialTooltip';