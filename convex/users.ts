import { v } from 'convex/values';
import { mutation } from './_generated/server';

// Create a new task with the given text
export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    image: v.string(),
    bio: v.optional(v.string()),
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // check if a user with the same clerkId already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (existingUser) {
      // if a user with the same clerkId exists, return early
      console.log('User already exists with clerkId:', args.clerkId);
      return;
    }
    // create a new user in the database
    await ctx.db.insert('users', {
      username: args.username,
      fullname: args.fullname,
      email: args.email,
      image: args.image,
      bio: args.bio,
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0,
    });
  },
});
