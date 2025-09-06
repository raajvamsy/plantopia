import { supabase } from '../config';
import type { Post, PostInsert, Comment, CommentInsert, Like, PostWithUser, CommentWithUser } from '@/types/api';

export class CommunityService {
  // Get all posts with user information
  static async getPosts(limit: number = 20, offset: number = 0): Promise<PostWithUser[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    return data;
  }

  // Get posts by a specific user
  static async getUserPosts(userId: string, limit: number = 20, offset: number = 0): Promise<PostWithUser[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching user posts:', error);
      return [];
    }

    return data;
  }

  // Get post by ID with full details
  static async getPostById(postId: string): Promise<PostWithUser | null> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      return null;
    }

    return data;
  }

  // Create new post
  static async createPost(postData: Omit<PostInsert, 'id'>): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return null;
    }

    return data;
  }

  // Update post
  static async updatePost(postId: string, updates: Partial<PostInsert>): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return null;
    }

    return data;
  }

  // Delete post
  static async deletePost(postId: string): Promise<boolean> {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting post:', error);
      return false;
    }

    return true;
  }

  // Get comments for a post
  static async getPostComments(postId: string): Promise<CommentWithUser[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    return data;
  }

  // Create new comment
  static async createComment(commentData: Omit<CommentInsert, 'id'>): Promise<Comment | null> {
    const { data, error } = await supabase
      .from('comments')
      .insert(commentData)
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return null;
    }

    return data;
  }

  // Update comment
  static async updateComment(commentId: string, updates: Partial<CommentInsert>): Promise<Comment | null> {
    const { data, error } = await supabase
      .from('comments')
      .update(updates)
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      return null;
    }

    return data;
  }

  // Delete comment
  static async deleteComment(commentId: string): Promise<boolean> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      return false;
    }

    return true;
  }

  // Like a post
  static async likePost(userId: string, postId: string): Promise<boolean> {
    const { error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        post_id: postId
      });

    if (error) {
      console.error('Error liking post:', error);
      return false;
    }

    return true;
  }

  // Unlike a post
  static async unlikePost(userId: string, postId: string): Promise<boolean> {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);

    if (error) {
      console.error('Error unliking post:', error);
      return false;
    }

    return true;
  }

  // Check if user has liked a post
  static async hasUserLikedPost(userId: string, postId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    if (error) {
      return false;
    }

    return !!data;
  }

  // Get posts from followed users
  static async getFollowedUsersPosts(userId: string, limit: number = 20, offset: number = 0): Promise<PostWithUser[]> {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        following_id,
        posts (
          *,
          users (
            id,
            username,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('follower_id', userId);

    if (error) {
      console.error('Error fetching followed users posts:', error);
      return [];
    }

    // Flatten and sort posts
    const posts = data
      .flatMap(item => item.posts || [])
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(offset, offset + limit);

    return posts;
  }

  // Search posts by content
  static async searchPosts(query: string, limit: number = 20): Promise<PostWithUser[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .ilike('content', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error searching posts:', error);
      return [];
    }

    return data;
  }

  // Get trending posts (most liked in last 7 days)
  static async getTrendingPosts(limit: number = 10): Promise<PostWithUser[]> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .gte('created_at', sevenDaysAgo)
      .order('likes_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching trending posts:', error);
      return [];
    }

    return data;
  }

  // Get post statistics
  static async getPostStats(postId: string): Promise<{
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
  }> {
    const post = await this.getPostById(postId);
    if (!post) {
      return { likesCount: 0, commentsCount: 0, isLiked: false };
    }

    // Check if current user has liked the post
    const { data: { user } } = await supabase.auth.getUser();
    const isLiked = user ? await this.hasUserLikedPost(user.id, postId) : false;

    return {
      likesCount: post.likes_count,
      commentsCount: post.comments_count,
      isLiked
    };
  }
}
