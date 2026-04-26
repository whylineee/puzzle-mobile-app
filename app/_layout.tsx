import { Href, Redirect, Stack, usePathname, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { UI } from '@/constants/ui';
import { SavedPlacesProvider } from '@/hooks/use-saved-places';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { PreferencesProvider } from '@/hooks/use-preferences';
import { ShopProvider } from '@/hooks/use-shop';

export default function RootLayout() {
  return (
    <SavedPlacesProvider>
      <PreferencesProvider>
        <AuthProvider>
          <ShopProvider>
            <AppNavigator />
            <StatusBar style="dark" />
          </ShopProvider>
        </AuthProvider>
      </PreferencesProvider>
    </SavedPlacesProvider>
  );
}

function AppNavigator() {
  const pathname = usePathname();
  const segments = useSegments();
  const { ready, isAuthenticated } = useAuth();

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: UI.colors.background,
        }}>
        <ActivityIndicator size="large" color={UI.colors.accent} />
      </View>
    );
  }

  const segmentList = segments as string[];
  const onAuthRoute = segmentList.includes('auth') || pathname === '/auth';

  return (
    <>
      {!isAuthenticated && !onAuthRoute ? <Redirect href={'/auth' as Href} /> : null}
      {isAuthenticated && onAuthRoute ? <Redirect href={'/explore' as Href} /> : null}
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
      <Stack.Screen name="settings" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="shop" />
      <Stack.Screen name="details" />
    </Stack>
    </>
  );
}
