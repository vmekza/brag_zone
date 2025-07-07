// app/_layout.tsx
import InitialLayout from '@/components/InitialLayout';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useSegments } from 'expo-router';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

export default function RootLayout() {
  const segments = useSegments();
  // const inAuthFlow = segments[0] === 'login';

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <ClerkLoaded>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <InitialLayout />
          </SafeAreaView>
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
