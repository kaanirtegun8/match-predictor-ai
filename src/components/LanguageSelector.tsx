import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedText } from './themed/ThemedText';
import { ThemedView } from './themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';

export const LanguageSelector = () => {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.border }]}>
      <View style={styles.leftContent}>
        <Ionicons 
          name="globe-outline" 
          size={18} 
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
    padding: 12,
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
    fontSize: 16,
    fontWeight: '500',
  },
  languageContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    padding: 2,
  },
  languageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedLanguageText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 