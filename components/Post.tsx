import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { styles } from '@/styles/feed.styles';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

type PostProps = {
  post: {
    _id: Id<'posts'>;
    imageUrl: string;
    caption?: string;
    likes: number;
    comments: number;
    _creationTime: number;
    isLiked: boolean;
    isBookmarked: boolean;
    creator: {
      _id: string;
      username: string;
      image: string;
    };
  };
};
export default function Post({ post }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const changeLike = useMutation(api.posts.changeLike);

  const handleLike = async () => {
    try {
      const newIsLiked = await changeLike({ postId: post._id });
      setIsLiked(newIsLiked);
      setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error('Error changing like:', error);
      Alert.alert('Error', 'Failed to like/unlike the post');
    }
  };

  return (
    <View style={styles.post}>
      {/* header section */}
      <View style={styles.postHeader}>
        <Link href={'/(tabs)/notifications'}>
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image
              source={post.creator.image}
              style={styles.postAvatar}
              contentFit='cover'
              transition={200}
              cachePolicy='memory-disk'
            />
            <Text style={styles.postUsername}>{post.creator.username}</Text>
          </TouchableOpacity>
        </Link>

        {/* delete post button*/}
        {/* <TouchableOpacity>
          <Ionicons
            name='ellipsis-horizontal'
            size={20}
            color={COLORS.white}
          ></Ionicons>
        </TouchableOpacity> */}
        <TouchableOpacity>
          <Ionicons name='trash-outline' size={20} color={COLORS.red} />
        </TouchableOpacity>
        {/* image section */}
        {/* IMAGE */}
      </View>
      <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit='cover'
        transition={200}
        cachePolicy='memory-disk'
      />

      {/* actions section */}
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? COLORS.primary : COLORS.white}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name='chatbubble-outline'
              size={22}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name={'bookmark-outline'} size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* post data section */}
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>
          {likesCount > 0
            ? `${likesCount.toLocaleString()} likes`
            : 'Be the first to like'}
        </Text>
        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{post.creator.username}</Text>
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>
        )}
        <TouchableOpacity>
          <Text style={styles.commentsText}>View all 2 comments</Text>
        </TouchableOpacity>
        <Text style={styles.timeAgo}>2 hours ago</Text>
      </View>
    </View>
  );
}
