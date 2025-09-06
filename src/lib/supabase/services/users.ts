import { supabase } from '../config';
import type { User, UserInsert, UserUpdate } from '@/types/api';

export class UserService {
  // Get current user profile
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  }

  // Get user by username
  static async getUserByUsername(username: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user by username:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in getUserByUsername:', error);
      return null;
    }
  }

  // Create new user profile
  static async createUser(userData: Omit<UserInsert, 'id'>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return data;
  }

  // Create new user profile with specific ID (for auth signup)
  static async createUserWithId(userData: UserInsert): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error('Error creating user with ID:', error);
      return null;
    }

    return data;
  }

  // Update user profile
  static async updateUser(userId: string, updates: UserUpdate): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return null;
    }

    return data;
  }

  // Update user's online status
  static async updateOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ 
        is_online: isOnline, 
        last_seen: isOnline ? null : new Date().toISOString() 
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating online status:', error);
    }
  }

  // Get user's followers
  static async getFollowers(userId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        follower_id,
        users!followers_follower_id_fkey (*)
      `)
      .eq('following_id', userId);

    if (error) {
      console.error('Error fetching followers:', error);
      return [];
    }

    return data.map(item => item.users as unknown as User);
  }

  // Get user's following
  static async getFollowing(userId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        following_id,
        users!followers_following_id_fkey (*)
      `)
      .eq('follower_id', userId);

    if (error) {
      console.error('Error fetching following:', error);
      return [];
    }

    return data.map(item => item.users as unknown as User);
  }

  // Follow a user
  static async followUser(followerId: string, followingId: string): Promise<boolean> {
    const { error } = await supabase
      .from('followers')
      .insert({
        follower_id: followerId,
        following_id: followingId
      });

    if (error) {
      console.error('Error following user:', error);
      return false;
    }

    return true;
  }

  // Unfollow a user
  static async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }

    return true;
  }

  // Check if user is following another user
  static async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    if (error) {
      return false;
    }

    return !!data;
  }

  // Search users by username or name
  static async searchUsers(query: string, currentUserId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .neq('id', currentUserId)
      .limit(10);

    if (error) {
      console.error('Error searching users:', error);
      return [];
    }

    return data;
  }
}
