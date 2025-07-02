import { useSSO } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import { styles } from '../../styles/auth.styles';

export default function Login() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
      });
      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        // Navigate to the home screen after successful login
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      alert('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* NAME AND SLOGAN */}
      <StatusBar hidden />
      <Video
        source={require('@/assets/images/video.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay // start playing as soon as it’s mounted
        isLooping // repeat forever
        isMuted // ← mute it so iOS will autoplay
        useNativeControls={false} // ← hide that play button overlay
      />
      <View style={styles.overlay}>
        <View style={styles.textBlock}>
          <Text style={styles.appName}>brag zone</Text>
          <Text style={styles.tagLine}>where every flex tells a story.</Text>
          <Text style={styles.tagLine}>share yours.</Text>
        </View>
      </View>

      {/* LOGIN */}
      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name='logo-google' size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
