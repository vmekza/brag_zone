import { useAuth } from '@clerk/clerk-expo';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    console.log('Segments:', segments);
    const inAuthFlow = segments[0] === '(auth)';

    if (!isSignedIn && !inAuthFlow) {
      router.replace('/(auth)/login');
    } else if (isSignedIn && inAuthFlow) {
      router.replace('/(tabs)');
    }
  }, [isLoaded, isSignedIn, segments]);

  if (!isLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}
