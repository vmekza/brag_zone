import { ResizeMode, Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
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
        <View style={styles.textBlock}>
          <Text style={styles.appName}>brag zone</Text>
          <Text style={styles.tagLine}>where every flex tell a story.</Text>
          <Text style={styles.tagLine}>share yours.</Text>
        </View>
      </View>
    </View>
  );
}
