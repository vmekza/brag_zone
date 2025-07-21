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
        const postCreator = (await ctx.db.get(post.userId))!;

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

export const changeLike = mutation({
  args: { postId: v.id('posts') },
  handler: async (ctx, args) => {
    const currentUser = await getAuthUser(ctx);

    // check if the user has already liked the post
    const existingLike = await ctx.db
      .query('likes')
      .withIndex('by_user_and_post', (q) =>
        q.eq('userId', currentUser._id).eq('postId', args.postId)
      )
      .first();

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error('Post not found');
    }
    if (existingLike) {
      // If the user has already liked the post, remove the like
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.postId, { likes: post.likes - 1 });
      return false;
    } else {
      // If the user has not liked the post, add a like
      await ctx.db.insert('likes', {
        userId: currentUser._id,
        postId: args.postId,
      });
      await ctx.db.patch(post._id, { likes: post.likes + 1 });

      // notification if it is not the current user post
      if (currentUser._id !== post.userId) {
        await ctx.db.insert('notifications', {
          receiverId: post.userId,
          senderId: currentUser._id,
          type: 'like',
          postId: args.postId,
        });
      }
      return true;
    }
  },
});
