import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useSegments, useRouter } from 'expo-router';
import { View, Text, Alert } from 'react-native';

// This is a simple auth check, you'll need to implement actual Firebase auth
function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      Alert.alert('Debug', `Segments: ${segments}\nAuth: ${isAuthenticated}`);
      
      const inAuthGroup = segments[0]?.includes('(auth)');
      console.log('Is in auth group:', inAuthGroup);
      
      if (!isAuthenticated && !inAuthGroup) {
        console.log('Redirecting to login...');
        // Redirect to the sign-in page
        router.replace('/(auth)/login');
      } else if (isAuthenticated && inAuthGroup) {
        console.log('Redirecting to bulletin...');
        // Redirect to the main app
        router.replace('/(tabs)/bulletin');
      }
    };

    checkAuth();
  }, [isAuthenticated, segments]);
}

export default function RootLayout() {
  Alert.alert('Layout Rendered');
  
  // TODO: Implement actual auth state check with Firebase
  const isAuthenticated = false;
  
  useProtectedRoute(isAuthenticated);

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="predictions" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
}
