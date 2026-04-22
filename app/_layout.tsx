import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
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
    </>
  );
}
