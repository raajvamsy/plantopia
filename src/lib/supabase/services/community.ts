import { supabase } from '../config';
import type { Post, PostInsert, Comment, CommentInsert, PostWithUser, CommentWithUser } from '@/types/api';

export class CommunityService {
  // Enhanced error handling wrapper
  private static handleDatabaseError(error: unknown, operation: string): void {
    const errorObj = error as { message?: string; code?: string; details?: string; hint?: string };
    console.error(`❌ ${operation} error:`, {
      message: errorObj?.message,
      code: errorObj?.code,
      details: errorObj?.details,
      hint: errorObj?.hint
    });
  }

  // Get all posts with user information
  static async getPosts(limit: number = 20, offset: number = 0): Promise<PostWithUser[]> {
    try {
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
        this.handleDatabaseError(error, 'Get posts');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in getPosts:', error);
      return [];
    }
  }

  // Get posts by a specific user
  static async getUserPosts(userId: string, limit: number = 20, offset: number = 0): Promise<PostWithUser[]> {
    try {
      if (!userId) {
        console.warn('⚠️  getUserPosts called with empty userId');
        return [];
      }

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
        this.handleDatabaseError(error, 'Get user posts');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in getUserPosts:', error);
      return [];
    }
  }

  // Get post by ID with full details
  static async getPostById(postId: string): Promise<PostWithUser | null> {
    try {
      if (!postId) {
        console.warn('⚠️  getPostById called with empty postId');
        return null;
      }

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
        if ((error as { code?: string })?.code === 'PGRST116') {
          console.log('ℹ️  No post found with ID:', postId);
          return null;
        }
        this.handleDatabaseError(error, 'Get post by ID');
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Exception in getPostById:', error);
      return null;
    }
  }

  // Create new post
  static async createPost(postData: Omit<PostInsert, 'id'>): Promise<Post | null> {
    try {
      // Validate required fields
      if (!postData.user_id || !postData.content) {
        console.error('❌ createPost called with missing required fields:', postData);
        return null;
      }

      // Normalize data
      const normalizedData = {
        ...postData,
        content: postData.content.trim(),
      };

      if (normalizedData.content.length === 0) {
        console.error('❌ Post content cannot be empty');
        return null;
      }

      if (normalizedData.content.length > 2000) {
        console.error('❌ Post content too long (max 2000 characters)');
        return null;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert(normalizedData)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Create post');
        return null;
      }

      console.log('✅ Post created successfully');
      return data;
    } catch (error) {
      console.error('❌ Exception in createPost:', error);
      return null;
    }
  }

  // Update post
  static async updatePost(postId: string, updates: Partial<PostInsert>): Promise<Post | null> {
    try {
      if (!postId) {
        console.error('❌ updatePost called with empty postId');
        return null;
      }

      if (!updates || Object.keys(updates).length === 0) {
        console.warn('⚠️  updatePost called with no updates');
        const post = await this.getPostById(postId);
        return post ? {
          id: post.id,
          user_id: post.user_id,
          content: post.content,
          image_url: post.image_url,
          likes_count: post.likes_count,
          comments_count: post.comments_count,
          created_at: post.created_at,
          updated_at: post.updated_at
        } : null;
      }

      // Normalize update data
      const normalizedUpdates: Partial<PostInsert> = { ...updates };
      
      if (updates.content) {
        normalizedUpdates.content = updates.content.trim();
        if (normalizedUpdates.content.length === 0) {
          console.error('❌ Post content cannot be empty');
          return null;
        }
        if (normalizedUpdates.content.length > 2000) {
          console.error('❌ Post content too long (max 2000 characters)');
          return null;
        }
      }

      const { data, error } = await supabase
        .from('posts')
        .update(normalizedUpdates)
        .eq('id', postId)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Update post');
        return null;
      }

      console.log('✅ Post updated successfully');
      return data;
    } catch (error) {
      console.error('❌ Exception in updatePost:', error);
      return null;
    }
  }

  // Delete post
  static async deletePost(postId: string): Promise<boolean> {
    try {
      if (!postId) {
        console.warn('⚠️  deletePost called with empty postId');
        return false;
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        this.handleDatabaseError(error, 'Delete post');
        return false;
      }

      console.log('✅ Post deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception in deletePost:', error);
      return false;
    }
  }

  // Get comments for a post
  static async getPostComments(postId: string): Promise<CommentWithUser[]> {
    try {
      if (!postId) {
        console.warn('⚠️  getPostComments called with empty postId');
        return [];
      }

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
        this.handleDatabaseError(error, 'Get post comments');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in getPostComments:', error);
      return [];
    }
  }

  // Create new comment
  static async createComment(commentData: Omit<CommentInsert, 'id'>): Promise<Comment | null> {
    try {
      // Validate required fields
      if (!commentData.post_id || !commentData.user_id || !commentData.content) {
        console.error('❌ createComment called with missing required fields:', commentData);
        return null;
      }

      // Normalize data
      const normalizedData = {
        ...commentData,
        content: commentData.content.trim(),
      };

      if (normalizedData.content.length === 0) {
        console.error('❌ Comment content cannot be empty');
        return null;
      }

      if (normalizedData.content.length > 500) {
        console.error('❌ Comment content too long (max 500 characters)');
        return null;
      }

      const { data, error } = await supabase
        .from('comments')
        .insert(normalizedData)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Create comment');
        return null;
      }

      console.log('✅ Comment created successfully');
      return data;
    } catch (error) {
      console.error('❌ Exception in createComment:', error);
      return null;
    }
  }

  // Update comment
  static async updateComment(commentId: string, updates: Partial<CommentInsert>): Promise<Comment | null> {
    try {
      if (!commentId) {
        console.error('❌ updateComment called with empty commentId');
        return null;
      }

      if (!updates || Object.keys(updates).length === 0) {
        console.warn('⚠️  updateComment called with no updates');
        return null;
      }

      // Normalize update data
      const normalizedUpdates: Partial<CommentInsert> = { ...updates };
      
      if (updates.content) {
        normalizedUpdates.content = updates.content.trim();
        if (normalizedUpdates.content.length === 0) {
          console.error('❌ Comment content cannot be empty');
          return null;
        }
        if (normalizedUpdates.content.length > 500) {
          console.error('❌ Comment content too long (max 500 characters)');
          return null;
        }
      }

      const { data, error } = await supabase
        .from('comments')
        .update(normalizedUpdates)
        .eq('id', commentId)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Update comment');
        return null;
      }

      console.log('✅ Comment updated successfully');
      return data;
    } catch (error) {
      console.error('❌ Exception in updateComment:', error);
      return null;
    }
  }

  // Delete comment
  static async deleteComment(commentId: string): Promise<boolean> {
    try {
      if (!commentId) {
        console.warn('⚠️  deleteComment called with empty commentId');
        return false;
      }

      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        this.handleDatabaseError(error, 'Delete comment');
        return false;
      }

      console.log('✅ Comment deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception in deleteComment:', error);
      return false;
    }
  }

  // Like a post
  static async likePost(userId: string, postId: string): Promise<boolean> {
    try {
      if (!userId || !postId) {
        console.warn('⚠️  likePost called with empty parameters');
        return false;
      }

      // Check if already liked
      const isAlreadyLiked = await this.hasUserLikedPost(userId, postId);
      if (isAlreadyLiked) {
        console.log('ℹ️  Post already liked by user');
        return true;
      }

      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: userId,
          post_id: postId
        });

      if (error) {
        if ((error as { code?: string })?.code === '23505') {
          console.log('ℹ️  Like already exists');
          return true;
        }
        this.handleDatabaseError(error, 'Like post');
        return false;
      }

      console.log('✅ Post liked successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception in likePost:', error);
      return false;
    }
  }

  // Unlike a post
  static async unlikePost(userId: string, postId: string): Promise<boolean> {
    try {
      if (!userId || !postId) {
        console.warn('⚠️  unlikePost called with empty parameters');
        return false;
      }

      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);

      if (error) {
        this.handleDatabaseError(error, 'Unlike post');
        return false;
      }

      console.log('✅ Post unliked successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception in unlikePost:', error);
      return false;
    }
  }

  // Check if user has liked a post
  static async hasUserLikedPost(userId: string, postId: string): Promise<boolean> {
    try {
      if (!userId || !postId) {
        return false;
      }

      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .maybeSingle();

      if (error) {
        this.handleDatabaseError(error, 'Check if user liked post');
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('❌ Exception in hasUserLikedPost:', error);
      return false;
    }
  }

  // Get posts from followed users
  static async getFollowedUsersPosts(userId: string, limit: number = 20, offset: number = 0): Promise<PostWithUser[]> {
    try {
      if (!userId) {
        console.warn('⚠️  getFollowedUsersPosts called with empty userId');
        return [];
      }

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
        this.handleDatabaseError(error, 'Get followed users posts');
        return [];
      }

      // Flatten and sort posts
      const posts = data
        .flatMap(item => item.posts || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(offset, offset + limit);

      return posts;
    } catch (error) {
      console.error('❌ Exception in getFollowedUsersPosts:', error);
      return [];
    }
  }

  // Search posts by content
  static async searchPosts(query: string, limit: number = 20): Promise<PostWithUser[]> {
    try {
      if (!query || query.trim().length === 0) {
        console.warn('⚠️  searchPosts called with empty query');
        return [];
      }

      const normalizedQuery = query.trim();
      
      if (normalizedQuery.length < 2) {
        console.warn('⚠️  Search query too short (minimum 2 characters)');
        return [];
      }

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
        .ilike('content', `%${normalizedQuery}%`)
        .order('created_at', { ascending: false })
        .limit(Math.min(limit, 50));

      if (error) {
        this.handleDatabaseError(error, 'Search posts');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in searchPosts:', error);
      return [];
    }
  }

  // Get trending posts (most liked in last 7 days)
  static async getTrendingPosts(limit: number = 10): Promise<PostWithUser[]> {
    try {
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
        .limit(Math.min(limit, 50));

      if (error) {
        this.handleDatabaseError(error, 'Get trending posts');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in getTrendingPosts:', error);
      return [];
    }
  }

  // Get post statistics
  static async getPostStats(postId: string): Promise<{
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
  }> {
    try {
      if (!postId) {
        console.warn('⚠️  getPostStats called with empty postId');
        return { likesCount: 0, commentsCount: 0, isLiked: false };
      }

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
    } catch (error) {
      console.error('❌ Exception in getPostStats:', error);
      return { likesCount: 0, commentsCount: 0, isLiked: false };
    }
  }
}