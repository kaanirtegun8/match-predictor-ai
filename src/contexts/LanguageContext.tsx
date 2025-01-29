import React, { createContext, useContext, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Import translations
import en from '../translations/en';
import tr from '../translations/tr';

// Initialize i18next
const i18nConfig: InitOptions = {
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  lng: Localization.locale.split('-')[0],
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
};

i18n.use(initReactI18next).init(i18nConfig);

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => Promise<void>;
  availableLanguages: { code: string; name: string }[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: async () => {},
  availableLanguages: [],
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceLanguage = Localization.locale.split('-')[0];
  const defaultLanguage = ['en', 'tr'].includes(deviceLanguage) ? deviceLanguage : 'en';
  const [language, setLanguageState] = useState(defaultLanguage);

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' },
  ];

  useEffect(() => {
    const initLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('userLanguage');
        
        if (!savedLanguage) {
          // İlk kez açılışta cihaz dilini kullan ve kaydet
          await AsyncStorage.setItem('userLanguage', defaultLanguage);
          setLanguageState(defaultLanguage);
          await i18n.changeLanguage(defaultLanguage);
        } else {
          // Kaydedilmiş dil varsa onu kullan
          setLanguageState(savedLanguage);
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error initializing language:', error);
      }
    };

    initLanguage();
  }, [defaultLanguage]);

  const setLanguage = async (lang: string) => {
    try {
      await AsyncStorage.setItem('userLanguage', lang);
      setLanguageState(lang);
      await i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        availableLanguages,
      }}
    >
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
}; 