import { supabase } from '../config';
import type { Achievement, AchievementInsert, AchievementUpdate } from '@/types/api';

export class AchievementService {
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

  // Get all achievements for a user with enhanced error handling
  static async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      if (!userId) {
        console.warn('⚠️  getUserAchievements called with empty userId');
        return [];
      }

      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        this.handleDatabaseError(error, 'Get user achievements');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in getUserAchievements:', error);
      return [];
    }
  }

  // Get achievement by ID with validation
  static async getAchievementById(achievementId: string): Promise<Achievement | null> {
    try {
      if (!achievementId) {
        console.warn('⚠️  getAchievementById called with empty achievementId');
        return null;
      }

      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('id', achievementId)
        .single();

      if (error) {
        if ((error as { code?: string })?.code === 'PGRST116') {
          console.log('ℹ️  No achievement found with ID:', achievementId);
          return null;
        }
        this.handleDatabaseError(error, 'Get achievement by ID');
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Exception in getAchievementById:', error);
      return null;
    }
  }

  // Enhanced achievement creation with validation
  static async createAchievement(achievementData: Omit<AchievementInsert, 'id'>): Promise<Achievement | null> {
    try {
      // Validate required fields
      if (!achievementData.user_id || !achievementData.achievement_type || 
          !achievementData.title || !achievementData.description || 
          !achievementData.icon || !achievementData.color) {
        console.error('❌ createAchievement called with missing required fields:', achievementData);
        return null;
      }

      // Normalize data
      const normalizedData = {
        ...achievementData,
        title: achievementData.title.trim(),
        description: achievementData.description.trim(),
        achievement_type: achievementData.achievement_type.trim(),
        icon: achievementData.icon.trim(),
        color: achievementData.color.trim(),
      };

      // Validate color format (should be hex color)
      if (!normalizedData.color.match(/^#[0-9A-Fa-f]{6}$/)) {
        console.warn('⚠️  Invalid color format, using default:', normalizedData.color);
        normalizedData.color = '#4ade80'; // Default green
      }

      const { data, error } = await supabase
        .from('achievements')
        .insert(normalizedData)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Create achievement');
        return null;
      }

      console.log('✅ Achievement created successfully:', data.title);
      return data;
    } catch (error) {
      console.error('❌ Exception in createAchievement:', error);
      return null;
    }
  }

  // Enhanced achievement update with validation
  static async updateAchievement(achievementId: string, updates: AchievementUpdate): Promise<Achievement | null> {
    try {
      if (!achievementId) {
        console.error('❌ updateAchievement called with empty achievementId');
        return null;
      }

      if (!updates || Object.keys(updates).length === 0) {
        console.warn('⚠️  updateAchievement called with no updates');
        return await this.getAchievementById(achievementId);
      }

      // Normalize update data
      const normalizedUpdates: AchievementUpdate = { ...updates };
      
      if (updates.title) {
        normalizedUpdates.title = updates.title.trim();
      }
      
      if (updates.description) {
        normalizedUpdates.description = updates.description.trim();
      }
      
      if (updates.achievement_type) {
        normalizedUpdates.achievement_type = updates.achievement_type.trim();
      }
      
      if (updates.icon) {
        normalizedUpdates.icon = updates.icon.trim();
      }
      
      if (updates.color) {
        normalizedUpdates.color = updates.color.trim();
        // Validate color format
        if (!normalizedUpdates.color.match(/^#[0-9A-Fa-f]{6}$/)) {
          console.warn('⚠️  Invalid color format in update, keeping original');
          delete normalizedUpdates.color;
        }
      }

      const { data, error } = await supabase
        .from('achievements')
        .update(normalizedUpdates)
        .eq('id', achievementId)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Update achievement');
        return null;
      }

      console.log('✅ Achievement updated successfully:', data.title);
      return data;
    } catch (error) {
      console.error('❌ Exception in updateAchievement:', error);
      return null;
    }
  }

  // Enhanced achievement completion with validation
  static async completeAchievement(achievementId: string, userId?: string): Promise<boolean> {
    try {
      if (!achievementId) {
        console.warn('⚠️  completeAchievement called with empty achievementId');
        return false;
      }

      // If userId is provided, verify the achievement belongs to the user
      if (userId) {
        const achievement = await this.getAchievementById(achievementId);
        if (!achievement) {
          console.error('❌ Achievement not found:', achievementId);
          return false;
        }
        
        if (achievement.user_id !== userId) {
          console.error('❌ Achievement does not belong to user:', { achievementId, userId });
          return false;
        }
        
        if (achievement.completed) {
          console.log('ℹ️  Achievement already completed:', achievementId);
          return true;
        }
      }

      const { error } = await supabase
        .from('achievements')
        .update({ 
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', achievementId);

      if (error) {
        this.handleDatabaseError(error, 'Complete achievement');
        return false;
      }

      console.log('✅ Achievement completed successfully:', achievementId);
      return true;
    } catch (error) {
      console.error('❌ Exception in completeAchievement:', error);
      return false;
    }
  }

  // Get completed achievements with enhanced filtering
  static async getCompletedAchievements(userId: string, limit?: number): Promise<Achievement[]> {
    try {
      if (!userId) {
        console.warn('⚠️  getCompletedAchievements called with empty userId');
        return [];
      }

      let query = supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('completed_at', { ascending: false });

      if (limit) {
        query = query.limit(Math.min(limit, 100));
      }

      const { data, error } = await query;

      if (error) {
        this.handleDatabaseError(error, 'Get completed achievements');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in getCompletedAchievements:', error);
      return [];
    }
  }

  // Get pending achievements with enhanced filtering
  static async getPendingAchievements(userId: string, limit?: number): Promise<Achievement[]> {
    try {
      if (!userId) {
        console.warn('⚠️  getPendingAchievements called with empty userId');
        return [];
      }

      let query = supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', false)
        .order('created_at', { ascending: true });

      if (limit) {
        query = query.limit(Math.min(limit, 100));
      }

      const { data, error } = await query;

      if (error) {
        this.handleDatabaseError(error, 'Get pending achievements');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in getPendingAchievements:', error);
      return [];
    }
  }

  // Enhanced achievement checking and awarding system
  static async checkAndAwardAchievements(userId: string): Promise<Achievement[]> {
    try {
      if (!userId) {
        console.warn('⚠️  checkAndAwardAchievements called with empty userId');
        return [];
      }

      console.log('🏆 Checking achievements for user:', userId);
      
      const awardedAchievements: Achievement[] = [];
      
      // Get user's current achievements
      const currentAchievements = await this.getUserAchievements(userId);
      const pendingAchievements = currentAchievements.filter(a => !a.completed);
      
      if (pendingAchievements.length === 0) {
        console.log('ℹ️  No pending achievements to check');
        return [];
      }

      // Check each pending achievement
      for (const achievement of pendingAchievements) {
        try {
          let shouldAward = false;

          switch (achievement.achievement_type) {
            case 'first_plant':
              shouldAward = await this.checkFirstPlantAchievement(userId);
              break;
            case 'plant_care':
              shouldAward = await this.checkPlantCareAchievement(userId);
              break;
            case 'community':
              shouldAward = await this.checkCommunityAchievement(userId);
              break;
            case 'hydration_hero':
              shouldAward = await this.checkHydrationHeroAchievement(userId);
              break;
            case 'sun_worshipper':
              shouldAward = await this.checkSunWorshipperAchievement(userId);
              break;
            case 'pest_pro':
              shouldAward = await this.checkPestProAchievement(userId);
              break;
            case 'growth_spurt':
              shouldAward = await this.checkGrowthSpurtAchievement(userId);
              break;
            case 'collector':
              shouldAward = await this.checkCollectorAchievement(userId);
              break;
            default:
              console.warn('⚠️  Unknown achievement type:', achievement.achievement_type);
          }

          if (shouldAward) {
            const completed = await this.completeAchievement(achievement.id, userId);
            if (completed) {
              // Get the updated achievement
              const updatedAchievement = await this.getAchievementById(achievement.id);
              if (updatedAchievement) {
                awardedAchievements.push(updatedAchievement);
                console.log('🎉 Achievement awarded:', achievement.title);
              }
            }
          }
        } catch (checkError) {
          console.error('❌ Error checking achievement:', achievement.achievement_type, checkError);
        }
      }

      console.log(`✅ Achievement check completed. Awarded: ${awardedAchievements.length}`);
      return awardedAchievements;
    } catch (error) {
      console.error('❌ Exception in checkAndAwardAchievements:', error);
      return [];
    }
  }

  // Enhanced achievement checkers with better error handling

  // Check if user should get first plant achievement
  private static async checkFirstPlantAchievement(userId: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('plants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_archived', false);

      if (error) {
        this.handleDatabaseError(error, 'Check first plant achievement');
        return false;
      }

      return (count || 0) >= 1;
    } catch (error) {
      console.error('❌ Exception in checkFirstPlantAchievement:', error);
      return false;
    }
  }

  // Check if user should get plant care achievement
  private static async checkPlantCareAchievement(userId: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed');

      if (error) {
        this.handleDatabaseError(error, 'Check plant care achievement');
        return false;
      }

      return (count || 0) >= 1;
    } catch (error) {
      console.error('❌ Exception in checkPlantCareAchievement:', error);
      return false;
    }
  }

  // Check if user should get community achievement
  private static async checkCommunityAchievement(userId: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        this.handleDatabaseError(error, 'Check community achievement');
        return false;
      }

      return (count || 0) >= 1;
    } catch (error) {
      console.error('❌ Exception in checkCommunityAchievement:', error);
      return false;
    }
  }

  // Check if user should get hydration hero achievement
  private static async checkHydrationHeroAchievement(userId: string): Promise<boolean> {
    try {
      // Check if user has watered plants at least 30 times
      const { count, error } = await supabase
        .from('plant_care_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('action', 'watering');

      if (error) {
        this.handleDatabaseError(error, 'Check hydration hero achievement');
        return false;
      }

      return (count || 0) >= 30;
    } catch (error) {
      console.error('❌ Exception in checkHydrationHeroAchievement:', error);
      return false;
    }
  }

  // Check if user should get sun worshipper achievement
  private static async checkSunWorshipperAchievement(userId: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('plants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_archived', false)
        .gte('sunlight', 80);

      if (error) {
        this.handleDatabaseError(error, 'Check sun worshipper achievement');
        return false;
      }

      return (count || 0) >= 10;
    } catch (error) {
      console.error('❌ Exception in checkSunWorshipperAchievement:', error);
      return false;
    }
  }

  // Check if user should get pest pro achievement
  private static async checkPestProAchievement(userId: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('plant_care_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('action', 'pest_control');

      if (error) {
        this.handleDatabaseError(error, 'Check pest pro achievement');
        return false;
      }

      return (count || 0) >= 1;
    } catch (error) {
      console.error('❌ Exception in checkPestProAchievement:', error);
      return false;
    }
  }

  // Check if user should get growth spurt achievement
  private static async checkGrowthSpurtAchievement(userId: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('plants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_archived', false)
        .gte('level', 5);

      if (error) {
        this.handleDatabaseError(error, 'Check growth spurt achievement');
        return false;
      }

      return (count || 0) >= 3;
    } catch (error) {
      console.error('❌ Exception in checkGrowthSpurtAchievement:', error);
      return false;
    }
  }

  // Check if user should get collector achievement
  private static async checkCollectorAchievement(userId: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('plants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_archived', false);

      if (error) {
        this.handleDatabaseError(error, 'Check collector achievement');
        return false;
      }

      return (count || 0) >= 50;
    } catch (error) {
      console.error('❌ Exception in checkCollectorAchievement:', error);
      return false;
    }
  }

  // Enhanced achievement statistics
  static async getAchievementStats(userId: string): Promise<{
    totalAchievements: number;
    completedAchievements: number;
    pendingAchievements: number;
    completionRate: number;
    recentlyCompleted: Achievement[];
    nextToComplete: Achievement[];
  }> {
    try {
      if (!userId) {
        console.warn('⚠️  getAchievementStats called with empty userId');
        return {
          totalAchievements: 0,
          completedAchievements: 0,
          pendingAchievements: 0,
          completionRate: 0,
          recentlyCompleted: [],
          nextToComplete: []
        };
      }

      const [allAchievements, recentlyCompleted] = await Promise.all([
        this.getUserAchievements(userId),
        this.getRecentlyCompletedAchievements(userId, 3)
      ]);
      
      const totalAchievements = allAchievements.length;
      const completedAchievements = allAchievements.filter(a => a.completed).length;
      const pendingAchievements = allAchievements.filter(a => !a.completed).length;
      const completionRate = totalAchievements > 0 
        ? Math.round((completedAchievements / totalAchievements) * 100)
        : 0;

      // Get next achievements to complete (pending ones)
      const nextToComplete = allAchievements
        .filter(a => !a.completed)
        .slice(0, 3);

      return {
        totalAchievements,
        completedAchievements,
        pendingAchievements,
        completionRate,
        recentlyCompleted,
        nextToComplete
      };
    } catch (error) {
      console.error('❌ Exception in getAchievementStats:', error);
      return {
        totalAchievements: 0,
        completedAchievements: 0,
        pendingAchievements: 0,
        completionRate: 0,
        recentlyCompleted: [],
        nextToComplete: []
      };
    }
  }

  // Get recently completed achievements with enhanced filtering
  static async getRecentlyCompletedAchievements(userId: string, limit: number = 5): Promise<Achievement[]> {
    try {
      if (!userId) {
        console.warn('⚠️  getRecentlyCompletedAchievements called with empty userId');
        return [];
      }

      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(Math.min(limit, 20));

      if (error) {
        this.handleDatabaseError(error, 'Get recently completed achievements');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in getRecentlyCompletedAchievements:', error);
      return [];
    }
  }

  // Delete achievement (admin function)
  static async deleteAchievement(achievementId: string, userId?: string): Promise<boolean> {
    try {
      if (!achievementId) {
        console.warn('⚠️  deleteAchievement called with empty achievementId');
        return false;
      }

      let query = supabase
        .from('achievements')
        .delete()
        .eq('id', achievementId);

      // If userId is provided, ensure user can only delete their own achievements
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { error } = await query;

      if (error) {
        this.handleDatabaseError(error, 'Delete achievement');
        return false;
      }

      console.log('✅ Achievement deleted successfully:', achievementId);
      return true;
    } catch (error) {
      console.error('❌ Exception in deleteAchievement:', error);
      return false;
    }
  }

  // Reset achievement (mark as incomplete)
  static async resetAchievement(achievementId: string, userId?: string): Promise<boolean> {
    try {
      if (!achievementId) {
        console.warn('⚠️  resetAchievement called with empty achievementId');
        return false;
      }

      let query = supabase
        .from('achievements')
        .update({ 
          completed: false,
          completed_at: null
        })
        .eq('id', achievementId);

      // If userId is provided, ensure user can only reset their own achievements
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { error } = await query;

      if (error) {
        this.handleDatabaseError(error, 'Reset achievement');
        return false;
      }

      console.log('✅ Achievement reset successfully:', achievementId);
      return true;
    } catch (error) {
      console.error('❌ Exception in resetAchievement:', error);
      return false;
    }
  }
}