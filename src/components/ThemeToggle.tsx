import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Colors } from '../constants/Colors';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const options: { label: string; value: 'system' | 'light' | 'dark' }[] = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Theme</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.option,
              { 
                backgroundColor: theme === option.value ? colors.primary : 'transparent',
                borderColor: colors.border,
              },
            ]}
            onPress={() => setTheme(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                { 
                  color: theme === option.value ? colors.buttonText : colors.text,
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 