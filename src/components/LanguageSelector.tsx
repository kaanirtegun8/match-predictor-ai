import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedText } from './themed/ThemedText';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isIPad = Platform.OS === 'ios' && SCREEN_WIDTH >= 768;

export const LanguageSelector = () => {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.border }]}>
      <View style={styles.leftContent}>
        <Ionicons 
          name="globe-outline" 
          size={isIPad ? 48 : 24} 
          color={colors.primary}
          style={styles.icon} 
        />
        <ThemedText style={styles.label}>{t('settings.language')}</ThemedText>
      </View>
      
      <View style={styles.languageContainer}>
        {availableLanguages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              language === lang.code && { backgroundColor: colors.primary },
            ]}
            onPress={() => setLanguage(lang.code)}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.languageText,
                language === lang.code && styles.selectedLanguageText,
              ]}
            >
              {lang.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: isIPad ? 32 : 16,
  },
  languageContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    padding: isIPad ? 4 : 2,
  },
  languageButton: {
    paddingVertical: isIPad ? 12 : 6,
    paddingHorizontal: isIPad ? 20 : 12,
    borderRadius: 10,
  },
  languageText: {
    fontSize: isIPad ? 24 : 14,
  },
  selectedLanguageText: {
    color: '#fff',
  },
}); 