import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useSegments, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0]?.includes('(auth)');
    const inTabsGroup = segments[0]?.includes('(tabs)');
    
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/bulletin');
    } else if (!inAuthGroup && !inTabsGroup) {
      // If we're not in any group, redirect based on auth state
      router.replace(isAuthenticated ? '/(tabs)/bulletin' : '/(auth)/login');
    }
  }, [isAuthenticated, loading, segments]);
}

export default function RootLayout() {
  const { loading } = useAuth();
  useProtectedRoute();

  if (loading) return null;

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="predictions" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
