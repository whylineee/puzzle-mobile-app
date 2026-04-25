import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SavedPlacesProvider } from '@/hooks/use-saved-places';

export default function RootLayout() {
  return (
    <SavedPlacesProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="collections" />
        <Stack.Screen name="saved" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="details" />
      </Stack>
      <StatusBar style="dark" />
    </SavedPlacesProvider>
  );
}
