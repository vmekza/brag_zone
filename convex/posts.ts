import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUser } from './users';

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Unauthorized: No user identity found');
  return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
  args: { caption: v.optional(v.string()), storageId: v.id('_storage') },

  handler: async (ctx, args) => {
    const currentUser = await getAuthUser(ctx);
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      throw new Error('Image URL not found');
    }

    // Create the post in the database
    const postId = await ctx.db.insert('posts', {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      caption: args.caption,
      likes: 0,
      comments: 0,
    });

    // Increase the user's post count
    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});

export const getPosts = query({
  handler: async (ctx) => {
    const currentUser = await getAuthUser(ctx);

    // Fetch posts from the database
    const posts = await ctx.db.query('posts').order('desc').collect();

    if (posts.length === 0) return [];

    // Fetch user data for each post
    const postsWithUserData = await Promise.all(
      posts.map(async (post) => {
        const postCreator = await ctx.db.get(post.userId);

        const like = await ctx.db
          .query('likes')
          .withIndex('by_user_and_post', (q) =>
            q.eq('userId', currentUser._id).eq('postId', post._id)
          )
          .first();

        const bookmark = await ctx.db
          .query('bookmarks')
          .withIndex('by_user_and_post', (q) =>
            q.eq('userId', currentUser._id).eq('postId', post._id)
          )
          .first();

        return {
          ...post,
          creator: {
            _id: postCreator?._id,
            username: postCreator?.username,
            image: postCreator?.image,
          },
          isLiked: !!like,
          isBookmarked: !!bookmark,
        };
      })
    );

    return postsWithUserData;
  },
});
