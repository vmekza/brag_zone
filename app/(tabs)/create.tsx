import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../constants/theme';
import { styles } from '../../styles/create.styles';

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  const handleShare = async () => {
    if (!image) return;

    try {
      setIsLoading(true);
      const uploadUrl = await generateUploadUrl();
      const uploadResult = await FileSystem.uploadAsync(uploadUrl, image, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        mimeType: 'image/jpeg',
      });

      if (uploadResult.status !== 200) throw new Error('Image upload failed');

      const { storageId } = JSON.parse(uploadResult.body);
      await createPost({ storageId, caption });

      router.push('/(tabs)');
    } catch (error) {
      console.error('Error sharing post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!image) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name='arrow-back' size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Flex</Text>
          <View style={{ width: 28 }} />
        </View>

        <TouchableOpacity
          style={styles.emptyImageContainer}
          onPress={pickImage}
        >
          <Ionicons name='image-outline' size={48} color={COLORS.gray} />
          <Text style={styles.emptyImageText}>Tap to drop your daily brag</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={styles.contentContainer}>
        {/* header section */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setImage(null);
              setCaption('');
            }}
            disabled={isLoading}
          >
            <Ionicons
              name='close-outline'
              size={28}
              color={isLoading ? COLORS.gray : COLORS.white}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Flex</Text>
          <TouchableOpacity
            style={[
              styles.shareButton,
              isLoading && styles.shareButtonDisabled,
            ]}
            disabled={isLoading || !image}
            onPress={handleShare}
          >
            {isLoading ? (
              <ActivityIndicator size='small' color={COLORS.primary} />
            ) : (
              <Text style={styles.shareText}>Drop it!</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps='handled'
          contentOffset={{ x: 0, y: 100 }}
        >
          <View style={[styles.content, isLoading && styles.contentDisabled]}>
            {/* image section */}
            <View style={styles.imageSection}>
              <Image
                source={image}
                style={styles.previewImage}
                contentFit='cover'
                transition={200}
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickImage}
                disabled={isLoading}
              >
                <Ionicons name='image-outline' size={20} color={COLORS.white} />
                <Text style={styles.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* caption section */}
            <View style={styles.inputSection}>
              <View style={styles.captionContainer}>
                <Image
                  source={user?.imageUrl}
                  style={styles.userAvatar}
                  contentFit='cover'
                  transition={200}
                />
                <TextInput
                  style={styles.captionInput}
                  placeholder='Add your flex caption...'
                  placeholderTextColor={COLORS.gray}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isLoading}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
