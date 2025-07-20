import React from 'react';
import { Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function Bookmarks() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Text>Bookmarks screen</Text>
    </View>
  );
}
