import { supabase } from '../config';
import type { Plant, PlantInsert, PlantUpdate, PlantCareLog } from '@/types/api';

export class PlantService {
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

  // Get all plants for a user with enhanced error handling
  static async getUserPlants(userId: string, includeArchived: boolean = false): Promise<Plant[]> {
    try {
      if (!userId) {
        console.warn('⚠️  getUserPlants called with empty userId');
        return [];
      }

      let query = supabase
        .from('plants')
        .select('*')
        .eq('user_id', userId);

      if (!includeArchived) {
        query = query.eq('is_archived', false);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        this.handleDatabaseError(error, 'Get user plants');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in getUserPlants:', error);
      return [];
    }
  }

  // Get plant by ID
  static async getPlantById(plantId: string): Promise<Plant | null> {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('id', plantId)
      .single();

    if (error) {
      console.error('Error fetching plant:', error);
      return null;
    }

    return data;
  }

  // Enhanced plant creation with validation
  static async createPlant(plantData: Omit<PlantInsert, 'id'>): Promise<Plant | null> {
    try {
      // Validate required fields
      if (!plantData.user_id || !plantData.name || !plantData.category) {
        console.error('❌ createPlant called with missing required fields:', plantData);
        return null;
      }

      // Normalize data
      const normalizedData = {
        ...plantData,
        name: plantData.name.trim(),
        species: plantData.species?.trim() || null,
        notes: plantData.notes?.trim() || null,
        health: Math.max(0, Math.min(100, plantData.health || 100)),
        moisture: Math.max(0, Math.min(100, plantData.moisture || 50)),
        sunlight: Math.max(0, Math.min(100, plantData.sunlight || 50)),
      };

      if (normalizedData.name.length === 0) {
        console.error('❌ Plant name cannot be empty');
        return null;
      }

      if (normalizedData.name.length > 100) {
        console.error('❌ Plant name too long (max 100 characters)');
        return null;
      }

      const { data, error } = await supabase
        .from('plants')
        .insert(normalizedData)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Create plant');
        return null;
      }

      console.log('✅ Plant created successfully:', data.name);
      return data;
    } catch (error) {
      console.error('❌ Exception in createPlant:', error);
      return null;
    }
  }

  // Update plant
  static async updatePlant(plantId: string, updates: PlantUpdate): Promise<Plant | null> {
    const { data, error } = await supabase
      .from('plants')
      .update(updates)
      .eq('id', plantId)
      .select()
      .single();

    if (error) {
      console.error('Error updating plant:', error);
      return null;
    }

    return data;
  }

  // Archive/unarchive plant
  static async togglePlantArchive(plantId: string, isArchived: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('plants')
      .update({ is_archived: isArchived })
      .eq('id', plantId);

    if (error) {
      console.error('Error toggling plant archive:', error);
      return false;
    }

    return true;
  }

  // Delete plant
  static async deletePlant(plantId: string): Promise<boolean> {
    const { error } = await supabase
      .from('plants')
      .delete()
      .eq('id', plantId);

    if (error) {
      console.error('Error deleting plant:', error);
      return false;
    }

    return true;
  }

  // Get plants by category
  static async getPlantsByCategory(userId: string, category: string): Promise<Plant[]> {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching plants by category:', error);
      return [];
    }

    return data;
  }

  // Update plant health metrics
  static async updatePlantMetrics(
    plantId: string, 
    updates: Pick<PlantUpdate, 'health' | 'moisture' | 'sunlight'>
  ): Promise<boolean> {
    const { error } = await supabase
      .from('plants')
      .update(updates)
      .eq('id', plantId);

    if (error) {
      console.error('Error updating plant metrics:', error);
      return false;
    }

    return true;
  }

  // Water plant
  static async waterPlant(plantId: string): Promise<boolean> {
    const { error } = await supabase
      .from('plants')
      .update({ 
        last_watered: new Date().toISOString(),
        moisture: 100 // Reset moisture to full
      })
      .eq('id', plantId);

    if (error) {
      console.error('Error watering plant:', error);
      return false;
    }

    return true;
  }

  // Fertilize plant
  static async fertilizePlant(plantId: string): Promise<boolean> {
    const { error } = await supabase
      .from('plants')
      .update({ 
        last_fertilized: new Date().toISOString()
      })
      .eq('id', plantId);

    if (error) {
      console.error('Error fertilizing plant:', error);
      return false;
    }

    return true;
  }

  // Get plant care history
  static async getPlantCareHistory(plantId: string): Promise<PlantCareLog[]> {
    const { data, error } = await supabase
      .from('plant_care_logs')
      .select('*')
      .eq('plant_id', plantId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching plant care history:', error);
      return [];
    }

    return data;
  }

  // Log plant care action
  static async logPlantCare(
    plantId: string, 
    userId: string, 
    action: string, 
    details?: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from('plant_care_logs')
      .insert({
        plant_id: plantId,
        user_id: userId,
        action,
        details
      });

    if (error) {
      console.error('Error logging plant care:', error);
      return false;
    }

    return true;
  }

  // Get plants that need watering (moisture < 30)
  static async getPlantsNeedingWater(userId: string): Promise<Plant[]> {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .lt('moisture', 30)
      .order('moisture', { ascending: true });

    if (error) {
      console.error('Error fetching plants needing water:', error);
      return [];
    }

    return data;
  }

  // Get plants that need attention (health < 70)
  static async getPlantsNeedingAttention(userId: string): Promise<Plant[]> {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .lt('health', 70)
      .order('health', { ascending: true });

    if (error) {
      console.error('Error fetching plants needing attention:', error);
      return [];
    }

    return data;
  }

  // Get plant statistics for dashboard
  static async getPlantStats(userId: string): Promise<{
    totalPlants: number;
    healthyPlants: number;
    plantsNeedingWater: number;
    plantsNeedingAttention: number;
    averageHealth: number;
  }> {
    const plants = await this.getUserPlants(userId, false);
    
    const totalPlants = plants.length;
    const healthyPlants = plants.filter(p => p.health >= 80).length;
    const plantsNeedingWater = plants.filter(p => p.moisture < 30).length;
    const plantsNeedingAttention = plants.filter(p => p.health < 70).length;
    const averageHealth = plants.length > 0 
      ? Math.round(plants.reduce((sum, p) => sum + p.health, 0) / plants.length)
      : 0;

    return {
      totalPlants,
      healthyPlants,
      plantsNeedingWater,
      plantsNeedingAttention,
      averageHealth
    };
  }
}