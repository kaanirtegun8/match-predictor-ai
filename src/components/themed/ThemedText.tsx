import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export const ThemedText: React.FC<TextProps> = ({ style, ...props }) => {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <Text
      style={[
        { color: colors.text },
        style,
      ]}
      {...props}
    />
  );
}; 