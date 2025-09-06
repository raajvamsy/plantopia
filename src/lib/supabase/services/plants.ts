import { supabase } from '../config';
import type { Plant, PlantInsert, PlantUpdate, PlantCareLog } from '@/types/api';

export class PlantService {
  // Get all plants for a user
  static async getUserPlants(userId: string, includeArchived: boolean = false): Promise<Plant[]> {
    let query = supabase
      .from('plants')
      .select('*')
      .eq('user_id', userId);

    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching plants:', error);
      return [];
    }

    return data;
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

  // Create new plant
  static async createPlant(plantData: Omit<PlantInsert, 'id'>): Promise<Plant | null> {
    const { data, error } = await supabase
      .from('plants')
      .insert(plantData)
      .select()
      .single();

    if (error) {
      console.error('Error creating plant:', error);
      return null;
    }

    return data;
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
