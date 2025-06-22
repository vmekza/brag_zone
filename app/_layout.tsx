// app/_layout.tsx
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Slot, useSegments } from 'expo-router';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

export default function RootLayout() {
  const segments = useSegments();
  // expo-router nests routes by folder; top-level "(auth)" means our auth flow
  const inAuthFlow = segments[0] === '(auth)';

  return (
    <ClerkProvider tokenCache={tokenCache}>
      {inAuthFlow ? (
        // No SafeAreaView here—so Login can go full-screen
        <Slot />
      ) : (
        // All your “real” app screens get the safe-area wrapper
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Slot />
          </SafeAreaView>
        </SafeAreaProvider>
      )}
    </ClerkProvider>
  );
}
