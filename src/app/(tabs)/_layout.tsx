import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#2f95dc',
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTitleStyle: {
        fontWeight: '600',
      },
      headerShadowVisible: false,
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