import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { useSubscription } from '@/hooks/useSubscription';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

/**
 * Two main tabs:
 * - Bulletin (Matches)
 * - Account (Profile)
 */
export default function TabLayout() {
  const { isDark } = useTheme();
  const { isSubscribed } = useSubscription();
  const colors = isDark ? Colors.dark : Colors.light;
  const { t } = useTranslation();

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
          title: t('navigation.tabs.bulletin'),
          headerTitle: t('navigation.titles.bulletin'),
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('navigation.tabs.account'),
          headerTitle: t('navigation.titles.myProfile'),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 32, alignItems: 'center' }}>
              <FontAwesome 
                name="user" 
                size={24} 
                color={focused ? (colors.primary) : color} 
              />
              {isSubscribed && (
                <View style={{ 
                  position: 'absolute',
                  top: -4,
                  right: -20,
                  backgroundColor: isDark ? colors.inputBackground : colors.background,
                  borderRadius: 8,
                  paddingHorizontal: 4,
                  height: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}>
                  <FontAwesome name="star" size={8} color={colors.primary} />
                  <Text style={{ 
                    color: colors.primary, 
                    fontSize: 8, 
                    fontWeight: '600',
                    marginTop: -1,
                  }}>
                    PRO
                  </Text>
                </View>
              )}
            </View>
          ),
          tabBarActiveTintColor: isSubscribed ? colors.primary : colors.primary,
        }}
      />
    </Tabs>
  );
} 