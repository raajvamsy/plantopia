import { supabase } from '../config';
import type { Task, TaskInsert, TaskUpdate } from '@/types/api';

export class TaskService {
  // Get all tasks for a user
  static async getUserTasks(userId: string, status?: string): Promise<Task[]> {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    return data;
  }

  // Get task by ID
  static async getTaskById(taskId: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      console.error('Error fetching task:', error);
      return null;
    }

    return data;
  }

  // Create new task
  static async createTask(taskData: Omit<TaskInsert, 'id'>): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return null;
    }

    return data;
  }

  // Update task
  static async updateTask(taskId: string, updates: TaskUpdate): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return null;
    }

    return data;
  }

  // Delete task
  static async deleteTask(taskId: string): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      return false;
    }

    return true;
  }

  // Mark task as completed
  static async completeTask(taskId: string): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', taskId);

    if (error) {
      console.error('Error completing task:', error);
      return false;
    }

    return true;
  }

  // Mark task as in progress
  static async startTask(taskId: string): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'in_progress' })
      .eq('id', taskId);

    if (error) {
      console.error('Error starting task:', error);
      return false;
    }

    return true;
  }

  // Get tasks for a specific plant
  static async getPlantTasks(plantId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('plant_id', plantId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching plant tasks:', error);
      return [];
    }

    return data;
  }

  // Get overdue tasks
  static async getOverdueTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .lt('due_date', new Date().toISOString())
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching overdue tasks:', error);
      return [];
    }

    return data;
  }

  // Get tasks due today
  static async getTasksDueToday(userId: string): Promise<Task[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .gte('due_date', startOfDay)
      .lt('due_date', endOfDay)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching tasks due today:', error);
      return [];
    }

    return data;
  }

  // Get tasks due this week
  static async getTasksDueThisWeek(userId: string): Promise<Task[]> {
    const today = new Date();
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).toISOString();

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .gte('due_date', today.toISOString())
      .lte('due_date', endOfWeek)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching tasks due this week:', error);
      return [];
    }

    return data;
  }

  // Create recurring tasks (e.g., daily watering)
  static async createRecurringTasks(userId: string, plantId: string): Promise<Task[]> {
    const recurringTasks: Omit<TaskInsert, 'id'>[] = [
      {
        user_id: userId,
        plant_id: plantId,
        title: 'Water plant',
        description: 'Give your plant a refreshing drink',
        type: 'watering' as const,
        priority: 'medium' as const,
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
      },
      {
        user_id: userId,
        plant_id: plantId,
        title: 'Check plant health',
        description: 'Monitor plant health and growth',
        type: 'other' as const,
        priority: 'low' as const,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Next week
      }
    ];

    const createdTasks: Task[] = [];
    
    for (const taskData of recurringTasks) {
      const task = await this.createTask(taskData);
      if (task) {
        createdTasks.push(task);
      }
    }

    return createdTasks;
  }

  // Get task statistics
  static async getTaskStats(userId: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    completionRate: number;
  }> {
    const allTasks = await this.getUserTasks(userId);
    
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === 'completed').length;
    const pendingTasks = allTasks.filter(t => t.status === 'pending').length;
    const overdueTasks = allTasks.filter(t => 
      t.status === 'pending' && t.due_date && new Date(t.due_date) < new Date()
    ).length;
    
    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRate
    };
  }
}
