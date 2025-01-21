import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export default function PredictionsLayout() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTitleStyle: {
        fontWeight: '600',
        color: colors.text,
      },
      headerTintColor: colors.text,
      presentation: 'modal',
      animation: 'slide_from_bottom',
      headerShadowVisible: true,
    }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Match Analysis',
        }}
      />
    </Stack>
  );
} 