import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useSegments, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

// Define valid root routes that don't need redirection
const VALID_ROOT_ROUTES = ['match', 'standings', 'predictions', 'analyze'];

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0]?.includes('(auth)');
    const inTabsGroup = segments[0]?.includes('(tabs)');
    const isValidRootRoute = segments[0] && VALID_ROOT_ROUTES.includes(segments[0]);
    
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/bulletin');
    } else if (!inAuthGroup && !inTabsGroup && !isValidRootRoute) {
      // Only redirect if not in any valid route
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
      <Stack.Screen name="match/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="standings/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="analyze/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
