import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, ColorTheme } from '@/constants/Colors';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ColorTheme;
  isPremiumTheme: boolean;
  togglePremiumTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  colors: Colors.light,
  isPremiumTheme: false,
  togglePremiumTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [isPremiumTheme, setIsPremiumTheme] = useState(false);
  const { isSubscribed } = useSubscription();

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedPremiumTheme = await AsyncStorage.getItem('premiumTheme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
      if (savedPremiumTheme) {
        setIsPremiumTheme(savedPremiumTheme === 'true');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const togglePremiumTheme = async () => {
    try {
      const newPremiumTheme = !isPremiumTheme;
      setIsPremiumTheme(newPremiumTheme);
      await AsyncStorage.setItem('premiumTheme', newPremiumTheme.toString());
    } catch (error) {
      console.error('Error saving premium theme:', error);
    }
  };

  const colors = useMemo(() => {
    if (isDark) {
      return isPremiumTheme && isSubscribed ? Colors.premiumDark : Colors.dark;
    }
    return isPremiumTheme && isSubscribed ? Colors.premiumLight : Colors.light;
  }, [isDark, isPremiumTheme, isSubscribed]);

  return (
    <ThemeContext.Provider value={{ 
      isDark, 
      toggleTheme, 
      colors,
      isPremiumTheme,
      togglePremiumTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 

