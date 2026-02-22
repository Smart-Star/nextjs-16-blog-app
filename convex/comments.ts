import { authComponent } from "./auth";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createComment = mutation({
  args: { postId: v.id("post"), body: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated!");
    }

    return await ctx.db.insert("comments", {
      postId: args.postId,
      body: args.body,
      authorId: user._id,
      authorName: user.name,
    });
  },
});

export const getCommentsByPostId = query({
  args: { postId: v.id("post") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .order("desc")
      .collect();
  },
});
