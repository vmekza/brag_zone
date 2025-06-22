import { ResizeMode, Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../styles/auth.styles';

export default function Login() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Video
        source={require('@/assets/images/video.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />
      <View style={styles.overlay}>
        <Text style={styles.appName}>one more</Text>
        <Text style={styles.tagLine}>...cause it's never too much</Text>
      </View>
    </View>
  );
}
