import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export const ThemedView: React.FC<ViewProps> = ({ style, ...props }) => {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        { backgroundColor: colors.background },
        style,
      ]}
      {...props}
    />
  );
}; 