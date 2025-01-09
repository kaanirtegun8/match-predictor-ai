import { Stack } from 'expo-router';

export default function PredictionsLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTitleStyle: {
        fontWeight: '600',
      },
      presentation: 'modal',
      animation: 'slide_from_bottom',
      headerShadowVisible: false,
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