import { supabase } from '../config';
import type { Achievement, AchievementInsert, AchievementUpdate } from '@/types/api';

export class AchievementService {
  // Get all achievements for a user
  static async getUserAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    return data;
  }

  // Get achievement by ID
  static async getAchievementById(achievementId: string): Promise<Achievement | null> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single();

    if (error) {
      console.error('Error fetching achievement:', error);
      return null;
    }

    return data;
  }

  // Create new achievement
  static async createAchievement(achievementData: Omit<AchievementInsert, 'id'>): Promise<Achievement | null> {
    const { data, error } = await supabase
      .from('achievements')
      .insert(achievementData)
      .select()
      .single();

    if (error) {
      console.error('Error creating achievement:', error);
      return null;
    }

    return data;
  }

  // Update achievement
  static async updateAchievement(achievementId: string, updates: AchievementUpdate): Promise<Achievement | null> {
    const { data, error } = await supabase
      .from('achievements')
      .update(updates)
      .eq('id', achievementId)
      .select()
      .single();

    if (error) {
      console.error('Error updating achievement:', error);
      return null;
    }

    return data;
  }

  // Mark achievement as completed
  static async completeAchievement(achievementId: string): Promise<boolean> {
    const { error } = await supabase
      .from('achievements')
      .update({ 
        completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', achievementId);

    if (error) {
      console.error('Error completing achievement:', error);
      return false;
    }

    return true;
  }

  // Get completed achievements
  static async getCompletedAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching completed achievements:', error);
      return [];
    }

    return data;
  }

  // Get pending achievements
  static async getPendingAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', false)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching pending achievements:', error);
      return [];
    }

    return data;
  }

  // Check and award achievements based on user actions
  static async checkAndAwardAchievements(userId: string): Promise<Achievement[]> {
    const awardedAchievements: Achievement[] = [];
    
    // Get user's current achievements
    const currentAchievements = await this.getUserAchievements(userId);
    
    // Check for specific achievement types
    for (const achievement of currentAchievements) {
      if (achievement.completed) continue;

      let shouldAward = false;

      switch (achievement.achievement_type) {
        case 'first_plant':
          shouldAward = await this.checkFirstPlantAchievement(userId);
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
      }

      if (shouldAward) {
        const completed = await this.completeAchievement(achievement.id);
        if (completed) {
          awardedAchievements.push(achievement);
        }
      }
    }

    return awardedAchievements;
  }

  // Check if user should get first plant achievement
  private static async checkFirstPlantAchievement(userId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('plants')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_archived', false);

    if (error) return false;
    return (count || 0) >= 1;
  }

  // Check if user should get hydration hero achievement
  private static async checkHydrationHeroAchievement(userId: string): Promise<boolean> {
    // This would need more complex logic to track consecutive days
    // For now, check if user has watered plants at least 30 times
    const { count, error } = await supabase
      .from('plant_care_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action', 'watering');

    if (error) return false;
    return (count || 0) >= 30;
  }

  // Check if user should get sun worshipper achievement
  private static async checkSunWorshipperAchievement(userId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('plants')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_archived', false)
      .gte('sunlight', 80);

    if (error) return false;
    return (count || 0) >= 10;
  }

  // Check if user should get pest pro achievement
  private static async checkPestProAchievement(userId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('plant_care_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action', 'pest_control');

    if (error) return false;
    return (count || 0) >= 1;
  }

  // Check if user should get growth spurt achievement
  private static async checkGrowthSpurtAchievement(userId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('plants')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_archived', false)
      .gte('level', 5);

    if (error) return false;
    return (count || 0) >= 3;
  }

  // Check if user should get collector achievement
  private static async checkCollectorAchievement(userId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('plants')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_archived', false);

    if (error) return false;
    return (count || 0) >= 50;
  }

  // Get achievement statistics
  static async getAchievementStats(userId: string): Promise<{
    totalAchievements: number;
    completedAchievements: number;
    pendingAchievements: number;
    completionRate: number;
  }> {
    const allAchievements = await this.getUserAchievements(userId);
    
    const totalAchievements = allAchievements.length;
    const completedAchievements = allAchievements.filter(a => a.completed).length;
    const pendingAchievements = allAchievements.filter(a => !a.completed).length;
    const completionRate = totalAchievements > 0 
      ? Math.round((completedAchievements / totalAchievements) * 100)
      : 0;

    return {
      totalAchievements,
      completedAchievements,
      pendingAchievements,
      completionRate
    };
  }

  // Get recently completed achievements
  static async getRecentlyCompletedAchievements(userId: string, limit: number = 5): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recently completed achievements:', error);
      return [];
    }

    return data;
  }
}
