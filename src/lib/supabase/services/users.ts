import { supabase } from '../config';
import type { User, UserInsert, UserInsertWithId, UserUpdate } from '@/types/api';

export class UserService {
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

  // Get current user profile - SMART LOOKUP with enhanced error handling
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('ℹ️  No authenticated user found');
        return null;
      }

      console.log('🔍 Looking for profile for auth user:', user.id, 'email:', user.email);

      // STRATEGY 1: Try to find by auth user ID (normal case)
      try {
        const { data: profileById, error: idError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileById) {
          console.log('✅ Found profile by ID:', profileById.username);
          return profileById;
        }

        if (idError && idError.code !== 'PGRST116') {
          this.handleDatabaseError(idError, 'Profile lookup by ID');
        }
      } catch (error) {
        console.warn('⚠️  Profile lookup by ID failed:', error);
      }

      // STRATEGY 2: Try to find by email (orphaned profile case)
      console.log('🔍 Profile not found by ID, trying email lookup...');
      try {
        const { data: profileByEmail, error: emailError } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();

        if (profileByEmail) {
          console.log('⚠️  Found orphaned profile by email:', {
            authUserId: user.id,
            profileUserId: profileByEmail.id,
            email: user.email,
            username: profileByEmail.username
          });
          
          // AUTOMATIC FIX: Update the profile ID to match auth user ID
          try {
            console.log('🔧 Auto-fixing orphaned profile...');
            const fixedProfile = await this.fixOrphanedProfile(profileByEmail.id, user.id);
            if (fixedProfile) {
              console.log('✅ Successfully auto-fixed orphaned profile');
              return fixedProfile;
            }
          } catch (fixError) {
            console.error('❌ Failed to auto-fix orphaned profile:', fixError);
            // Return the orphaned profile as-is for now
            return profileByEmail;
          }
        }

        if (emailError && emailError.code !== 'PGRST116') {
          this.handleDatabaseError(emailError, 'Profile lookup by email');
        }
      } catch (error) {
        console.warn('⚠️  Profile lookup by email failed:', error);
      }

      console.log('❌ No profile found by ID or email for user:', user.id);
      return null;
    } catch (error) {
      console.error('❌ Exception in getCurrentUser:', error);
      return null;
    }
  }

  // Get user by ID with enhanced error handling
  static async getUserById(userId: string): Promise<User | null> {
    try {
      if (!userId) {
        console.warn('⚠️  getUserById called with empty userId');
        return null;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if ((error as { code?: string })?.code === 'PGRST116') {
          console.log('ℹ️  No user found with ID:', userId);
          return null;
        }
        this.handleDatabaseError(error, 'Get user by ID');
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Exception in getUserById:', error);
      return null;
    }
  }

  // Get user by username with enhanced validation
  static async getUserByUsername(username: string): Promise<User | null> {
    try {
      if (!username || username.trim().length === 0) {
        console.warn('⚠️  getUserByUsername called with empty username');
        return null;
      }

      // Normalize username (trim and lowercase for comparison)
      const normalizedUsername = username.trim().toLowerCase();

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('username', normalizedUsername)
        .maybeSingle();

      if (error) {
        this.handleDatabaseError(error, 'Get user by username');
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Exception in getUserByUsername:', error);
      return null;
    }
  }

  // Get user by email with enhanced validation
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (!email || !email.includes('@')) {
        console.warn('⚠️  getUserByEmail called with invalid email:', email);
        return null;
      }

      // Normalize email (trim and lowercase)
      const normalizedEmail = email.trim().toLowerCase();

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (error) {
        this.handleDatabaseError(error, 'Get user by email');
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Exception in getUserByEmail:', error);
      return null;
    }
  }

  // Enhanced orphaned profile fix with better validation
  static async fixOrphanedProfile(oldId: string, newId: string): Promise<User | null> {
    try {
      if (!oldId || !newId) {
        console.error('❌ fixOrphanedProfile called with invalid IDs:', { oldId, newId });
        return null;
      }

      if (oldId === newId) {
        console.warn('⚠️  fixOrphanedProfile called with same IDs, no action needed');
        const existingProfile = await this.getUserById(oldId);
        return existingProfile;
      }

      console.log('🔧 Attempting to fix orphaned profile:', { oldId, newId });
      
      // First, check if the new ID already exists (would cause conflict)
      const existingNewProfile = await this.getUserById(newId);
      if (existingNewProfile) {
        console.error('❌ Cannot fix orphaned profile: new ID already exists:', newId);
        return null;
      }
      
      // Get the old profile to verify it exists
      const oldProfile = await this.getUserById(oldId);
      if (!oldProfile) {
        console.error('❌ Cannot fix orphaned profile: old profile does not exist:', oldId);
        return null;
      }
      
      // Update the profile ID to match the auth user ID
      console.log('🔄 Updating profile ID in database...');
      const { data, error } = await supabase
        .from('users')
        .update({ id: newId })
        .eq('id', oldId)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Fix orphaned profile');
        return null;
      }

      if (!data) {
        console.error('❌ No data returned from profile fix operation');
        return null;
      }

      console.log('✅ Successfully fixed orphaned profile:', data.username);
      return data;
    } catch (error) {
      console.error('❌ Exception in fixOrphanedProfile:', error);
      return null;
    }
  }

  // Enhanced user creation with validation
  static async createUser(userData: Omit<UserInsert, 'id'>): Promise<User | null> {
    try {
      // Validate required fields
      if (!userData.email || !userData.username) {
        console.error('❌ createUser called with missing required fields:', userData);
        return null;
      }

      // Normalize data
      const normalizedData = {
        ...userData,
        email: userData.email.trim().toLowerCase(),
        username: userData.username.trim(),
        full_name: userData.full_name?.trim() || null,
        bio: userData.bio?.trim() || null,
      };

      const { data, error } = await supabase
        .from('users')
        .insert(normalizedData)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Create user');
        return null;
      }

      console.log('✅ User created successfully:', data.username);
      return data;
    } catch (error) {
      console.error('❌ Exception in createUser:', error);
      return null;
    }
  }

  // Enhanced user creation with specific ID and better username conflict resolution
  static async createUserWithId(userData: UserInsertWithId): Promise<User | null> {
    try {
      // Validate required fields
      if (!userData.id || !userData.email || !userData.username) {
        console.error('❌ createUserWithId called with missing required fields:', userData);
        return null;
      }

      // Normalize data
      const normalizedData = {
        ...userData,
        email: userData.email.trim().toLowerCase(),
        username: userData.username.trim(),
        full_name: userData.full_name?.trim() || null,
        bio: userData.bio?.trim() || null,
      };

      // Enhanced username conflict resolution
      let attempts = 0;
      const maxAttempts = 5;
      
      while (attempts < maxAttempts) {
        attempts++;
        
        try {
          // Check if username is already taken
          const existingUser = await this.getUserByUsername(normalizedData.username);
          
          if (existingUser && existingUser.id !== normalizedData.id) {
            if (attempts === maxAttempts) {
              console.error('❌ Unable to find unique username after', maxAttempts, 'attempts');
              return null;
            }
            
            // Generate a unique username
            const timestamp = Date.now();
            const randomSuffix = Math.floor(Math.random() * 1000);
            normalizedData.username = `${userData.username.trim()}_${timestamp}_${randomSuffix}`;
            
            console.log(`⚠️  Username taken, trying unique variant (attempt ${attempts}):`, normalizedData.username);
            continue;
          }
          
          // Username is available, proceed with creation
          break;
        } catch (usernameCheckError) {
          console.warn(`⚠️  Username check failed on attempt ${attempts}:`, usernameCheckError);
          
          if (attempts === maxAttempts) {
            // Proceed with creation anyway, let the database handle conflicts
            console.log('ℹ️  Proceeding with user creation despite username check failures');
            break;
          }
        }
      }

      const { data, error } = await supabase
        .from('users')
        .insert(normalizedData)
        .select()
        .single();

      if (error) {
        // Handle specific database errors
        if ((error as { code?: string; message?: string })?.code === '23505') { // Unique constraint violation
          const errorMessage = (error as { message?: string })?.message || '';
          if (errorMessage.includes('username')) {
            console.error('❌ Username already exists despite checks:', normalizedData.username);
          } else if (errorMessage.includes('email')) {
            console.error('❌ Email already exists:', normalizedData.email);
          } else if (errorMessage.includes('id')) {
            console.error('❌ User ID already exists:', normalizedData.id);
          }
        }
        
        this.handleDatabaseError(error, 'Create user with ID');
        return null;
      }

      console.log('✅ User created successfully with ID:', data.username, 'ID:', data.id);
      return data;
    } catch (error) {
      console.error('❌ Exception in createUserWithId:', error);
      return null;
    }
  }

  // Enhanced user update with validation
  static async updateUser(userId: string, updates: UserUpdate): Promise<User | null> {
    try {
      if (!userId) {
        console.error('❌ updateUser called with empty userId');
        return null;
      }

      if (!updates || Object.keys(updates).length === 0) {
        console.warn('⚠️  updateUser called with no updates');
        return await this.getUserById(userId);
      }

      // Normalize update data
      const normalizedUpdates: UserUpdate = {};
      
      if (updates.email) {
        normalizedUpdates.email = updates.email.trim().toLowerCase();
      }
      
      if (updates.username) {
        normalizedUpdates.username = updates.username.trim();
        
        // Check if username is already taken by another user
        const existingUser = await this.getUserByUsername(normalizedUpdates.username);
        if (existingUser && existingUser.id !== userId) {
          console.error('❌ Username already taken by another user:', normalizedUpdates.username);
          return null;
        }
      }
      
      if (updates.full_name !== undefined) {
        normalizedUpdates.full_name = updates.full_name?.trim() || null;
      }
      
      if (updates.bio !== undefined) {
        normalizedUpdates.bio = updates.bio?.trim() || null;
      }
      
      // Copy other fields as-is
      Object.keys(updates).forEach(key => {
        if (!['email', 'username', 'full_name', 'bio'].includes(key)) {
          (normalizedUpdates as Record<string, unknown>)[key] = (updates as Record<string, unknown>)[key];
        }
      });

      const { data, error } = await supabase
        .from('users')
        .update(normalizedUpdates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        if ((error as { code?: string; message?: string })?.code === '23505' && (error as { message?: string })?.message?.includes('username')) {
          console.error('❌ Username already exists:', normalizedUpdates.username);
        } else {
          this.handleDatabaseError(error, 'Update user');
        }
        return null;
      }

      console.log('✅ User updated successfully:', data.username);
      return data;
    } catch (error) {
      console.error('❌ Exception in updateUser:', error);
      return null;
    }
  }

  // Enhanced online status update with error handling
  static async updateOnlineStatus(userId: string, isOnline: boolean): Promise<boolean> {
    try {
      if (!userId) {
        console.warn('⚠️  updateOnlineStatus called with empty userId');
        return false;
      }

      const updates = { 
        is_online: isOnline, 
        last_seen: isOnline ? null : new Date().toISOString() 
      };

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) {
        this.handleDatabaseError(error, 'Update online status');
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Exception in updateOnlineStatus:', error);
      return false;
    }
  }

  // Enhanced followers retrieval with error handling
  static async getFollowers(userId: string): Promise<User[]> {
    try {
      if (!userId) {
        console.warn('⚠️  getFollowers called with empty userId');
        return [];
      }

      const { data, error } = await supabase
        .from('followers')
        .select(`
          follower_id,
          users!followers_follower_id_fkey (*)
        `)
        .eq('following_id', userId);

      if (error) {
        this.handleDatabaseError(error, 'Get followers');
        return [];
      }

      return data.map(item => item.users as unknown as User).filter(Boolean);
    } catch (error) {
      console.error('❌ Exception in getFollowers:', error);
      return [];
    }
  }

  // Enhanced following retrieval with error handling
  static async getFollowing(userId: string): Promise<User[]> {
    try {
      if (!userId) {
        console.warn('⚠️  getFollowing called with empty userId');
        return [];
      }

      const { data, error } = await supabase
        .from('followers')
        .select(`
          following_id,
          users!followers_following_id_fkey (*)
        `)
        .eq('follower_id', userId);

      if (error) {
        this.handleDatabaseError(error, 'Get following');
        return [];
      }

      return data.map(item => item.users as unknown as User).filter(Boolean);
    } catch (error) {
      console.error('❌ Exception in getFollowing:', error);
      return [];
    }
  }

  // Enhanced follow user with validation
  static async followUser(followerId: string, followingId: string): Promise<boolean> {
    try {
      if (!followerId || !followingId) {
        console.warn('⚠️  followUser called with empty IDs:', { followerId, followingId });
        return false;
      }

      if (followerId === followingId) {
        console.warn('⚠️  User cannot follow themselves');
        return false;
      }

      // Check if already following
      const isAlreadyFollowing = await this.isFollowing(followerId, followingId);
      if (isAlreadyFollowing) {
        console.log('ℹ️  User is already following this user');
        return true;
      }

      const { error } = await supabase
        .from('followers')
        .insert({
          follower_id: followerId,
          following_id: followingId
        });

      if (error) {
        if ((error as { code?: string })?.code === '23505') {
          console.log('ℹ️  Follow relationship already exists');
          return true;
        }
        this.handleDatabaseError(error, 'Follow user');
        return false;
      }

      console.log('✅ User followed successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception in followUser:', error);
      return false;
    }
  }

  // Enhanced unfollow user with validation
  static async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    try {
      if (!followerId || !followingId) {
        console.warn('⚠️  unfollowUser called with empty IDs:', { followerId, followingId });
        return false;
      }

      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      if (error) {
        this.handleDatabaseError(error, 'Unfollow user');
        return false;
      }

      console.log('✅ User unfollowed successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception in unfollowUser:', error);
      return false;
    }
  }

  // Enhanced follow status check
  static async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    try {
      if (!followerId || !followingId) {
        return false;
      }

      const { data, error } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .maybeSingle();

      if (error) {
        this.handleDatabaseError(error, 'Check follow status');
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('❌ Exception in isFollowing:', error);
      return false;
    }
  }

  // Enhanced user search with better filtering
  static async searchUsers(query: string, currentUserId: string, limit: number = 10): Promise<User[]> {
    try {
      if (!query || query.trim().length === 0) {
        console.warn('⚠️  searchUsers called with empty query');
        return [];
      }

      if (!currentUserId) {
        console.warn('⚠️  searchUsers called with empty currentUserId');
        return [];
      }

      const normalizedQuery = query.trim();
      
      // Search by username and full_name with case-insensitive matching
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`username.ilike.%${normalizedQuery}%,full_name.ilike.%${normalizedQuery}%`)
        .neq('id', currentUserId)
        .limit(Math.min(limit, 50)); // Cap at 50 results

      if (error) {
        this.handleDatabaseError(error, 'Search users');
        return [];
      }

      // Sort results by relevance (exact matches first, then partial matches)
      return data.sort((a, b) => {
        const aUsernameExact = a.username.toLowerCase() === normalizedQuery.toLowerCase();
        const bUsernameExact = b.username.toLowerCase() === normalizedQuery.toLowerCase();
        
        if (aUsernameExact && !bUsernameExact) return -1;
        if (!aUsernameExact && bUsernameExact) return 1;
        
        const aNameExact = a.full_name?.toLowerCase() === normalizedQuery.toLowerCase();
        const bNameExact = b.full_name?.toLowerCase() === normalizedQuery.toLowerCase();
        
        if (aNameExact && !bNameExact) return -1;
        if (!aNameExact && bNameExact) return 1;
        
        // Sort by username alphabetically
        return a.username.localeCompare(b.username);
      });
    } catch (error) {
      console.error('❌ Exception in searchUsers:', error);
      return [];
    }
  }

  // Enhanced user deletion (for admin purposes or account deletion)
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      if (!userId) {
        console.warn('⚠️  deleteUser called with empty userId');
        return false;
      }

      // Note: This will cascade delete related records due to foreign key constraints
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        this.handleDatabaseError(error, 'Delete user');
        return false;
      }

      console.log('✅ User deleted successfully:', userId);
      return true;
    } catch (error) {
      console.error('❌ Exception in deleteUser:', error);
      return false;
    }
  }

  // Get user statistics
  static async getUserStats(userId: string): Promise<{
    totalFollowers: number;
    totalFollowing: number;
    joinDate: string;
    lastSeen: string | null;
    isOnline: boolean;
  } | null> {
    try {
      if (!userId) {
        console.warn('⚠️  getUserStats called with empty userId');
        return null;
      }

      const [user, followers, following] = await Promise.all([
        this.getUserById(userId),
        this.getFollowers(userId),
        this.getFollowing(userId)
      ]);

      if (!user) {
        return null;
      }

      return {
        totalFollowers: followers.length,
        totalFollowing: following.length,
        joinDate: user.created_at,
        lastSeen: user.last_seen,
        isOnline: user.is_online
      };
    } catch (error) {
      console.error('❌ Exception in getUserStats:', error);
      return null;
    }
  }
}