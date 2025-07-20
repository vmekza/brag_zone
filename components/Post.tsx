import { COLORS } from '@/constants/theme';
import { styles } from '@/styles/feed.styles';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Post({ post }: { post: any }) {
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
          <TouchableOpacity>
            <Ionicons name={'heart-outline'} size={24} color={COLORS.white} />
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

      {/* post info section */}
    </View>
  );
}
