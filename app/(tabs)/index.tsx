import { Loader } from '@/components/Loader';
import Post from '@/components/Post';
import Story from '@/components/Story';
import { STORIES } from '@/constants/mock-data';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import React from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../constants/theme';
import { styles } from '../../styles/feed.styles';

export default function Index() {
  const { signOut } = useAuth();

  const posts = useQuery(api.posts.getPosts);

  if (posts === undefined) return <Loader />;
  if (posts.length === 0) return <NoPosts />;

  return (
    <View style={styles.container}>
      {/* header section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>brag zone</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name='log-out-outline' size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={<StoryContent />}
      />
    </View>
  );
}
const StoryContent = () => {
  return (
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
      style={styles.storiesContainer}
    >
      {STORIES.map((story) => (
        <Story key={story.id} story={story} />
      ))}
    </ScrollView>
  );
};

const NoPosts = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={{ fontSize: 20, color: COLORS.primary }}>
      Hmmm... No bragging posts yet
    </Text>
  </View>
);
