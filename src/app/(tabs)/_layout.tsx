import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

/**
 * Two main tabs:
 * - Bulletin (Matches)
 * - Account (Profile)
 */
export default function TabLayout() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarStyle: {
        backgroundColor: colors.background,
        borderTopColor: colors.border,
      },
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTitleStyle: {
        fontWeight: '600',
        color: colors.text,
      },
      headerShadowVisible: true,
      headerTintColor: colors.text,
    }}>
      <Tabs.Screen
        name="bulletin"
        options={{
          title: 'Matches',
          headerTitle: 'Matches',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerTitle: 'My Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 