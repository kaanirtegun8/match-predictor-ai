import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useSegments, useRouter } from 'expo-router';

// This is a simple auth check, you'll need to implement actual Firebase auth
function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0]?.includes('(auth)');
    
    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page
      router.replace({ pathname: '/(auth)/login' } as any);
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to the main app
      router.replace({ pathname: '/(tabs)/bulletin' } as any);
    }
  }, [isAuthenticated, segments]);
}

export default function RootLayout() {
  // TODO: Implement actual auth state check with Firebase
  const isAuthenticated = false;
  
  useProtectedRoute(isAuthenticated);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="predictions" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
