import { supabase } from '../config';
import type { Task, TaskInsert, TaskUpdate } from '@/types/api';

export class TaskService {
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

  // Get all tasks for a user with enhanced error handling
  static async getUserTasks(userId: string, status?: string): Promise<Task[]> {
    try {
      if (!userId) {
        console.warn('⚠️  getUserTasks called with empty userId');
        return [];
      }

      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('due_date', { ascending: true });

      if (error) {
        this.handleDatabaseError(error, 'Get user tasks');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in getUserTasks:', error);
      return [];
    }
  }

  // Get task by ID with validation
  static async getTaskById(taskId: string): Promise<Task | null> {
    try {
      if (!taskId) {
        console.warn('⚠️  getTaskById called with empty taskId');
        return null;
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) {
        if ((error as { code?: string })?.code === 'PGRST116') {
          console.log('ℹ️  No task found with ID:', taskId);
          return null;
        }
        this.handleDatabaseError(error, 'Get task by ID');
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Exception in getTaskById:', error);
      return null;
    }
  }

  // Enhanced task creation with validation
  static async createTask(taskData: Omit<TaskInsert, 'id'>): Promise<Task | null> {
    try {
      // Validate required fields
      if (!taskData.user_id || !taskData.title || !taskData.type) {
        console.error('❌ createTask called with missing required fields:', taskData);
        return null;
      }

      // Normalize data
      const normalizedData = {
        ...taskData,
        title: taskData.title.trim(),
        description: taskData.description?.trim() || null,
      };

      if (normalizedData.title.length === 0) {
        console.error('❌ Task title cannot be empty');
        return null;
      }

      if (normalizedData.title.length > 200) {
        console.error('❌ Task title too long (max 200 characters)');
        return null;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert(normalizedData)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Create task');
        return null;
      }

      console.log('✅ Task created successfully:', data.title);
      return data;
    } catch (error) {
      console.error('❌ Exception in createTask:', error);
      return null;
    }
  }

  // Enhanced task update with validation
  static async updateTask(taskId: string, updates: TaskUpdate): Promise<Task | null> {
    try {
      if (!taskId) {
        console.error('❌ updateTask called with empty taskId');
        return null;
      }

      if (!updates || Object.keys(updates).length === 0) {
        console.warn('⚠️  updateTask called with no updates');
        return await this.getTaskById(taskId);
      }

      // Normalize update data
      const normalizedUpdates: TaskUpdate = { ...updates };
      
      if (updates.title) {
        normalizedUpdates.title = updates.title.trim();
        if (normalizedUpdates.title.length === 0) {
          console.error('❌ Task title cannot be empty');
          return null;
        }
        if (normalizedUpdates.title.length > 200) {
          console.error('❌ Task title too long (max 200 characters)');
          return null;
        }
      }
      
      if (updates.description !== undefined) {
        normalizedUpdates.description = updates.description?.trim() || null;
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(normalizedUpdates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Update task');
        return null;
      }

      console.log('✅ Task updated successfully:', data.title);
      return data;
    } catch (error) {
      console.error('❌ Exception in updateTask:', error);
      return null;
    }
  }

  // Enhanced task deletion with validation
  static async deleteTask(taskId: string, userId?: string): Promise<boolean> {
    try {
      if (!taskId) {
        console.warn('⚠️  deleteTask called with empty taskId');
        return false;
      }

      let query = supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      // If userId is provided, ensure user can only delete their own tasks
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { error } = await query;

      if (error) {
        this.handleDatabaseError(error, 'Delete task');
        return false;
      }

      console.log('✅ Task deleted successfully:', taskId);
      return true;
    } catch (error) {
      console.error('❌ Exception in deleteTask:', error);
      return false;
    }
  }

  // Enhanced task completion with validation
  static async completeTask(taskId: string, userId?: string): Promise<boolean> {
    try {
      if (!taskId) {
        console.warn('⚠️  completeTask called with empty taskId');
        return false;
      }

      // If userId is provided, verify the task belongs to the user
      if (userId) {
        const task = await this.getTaskById(taskId);
        if (!task) {
          console.error('❌ Task not found:', taskId);
          return false;
        }
        
        if (task.user_id !== userId) {
          console.error('❌ Task does not belong to user:', { taskId, userId });
          return false;
        }
        
        if (task.status === 'completed') {
          console.log('ℹ️  Task already completed:', taskId);
          return true;
        }
      }

      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) {
        this.handleDatabaseError(error, 'Complete task');
        return false;
      }

      console.log('✅ Task completed successfully:', taskId);
      return true;
    } catch (error) {
      console.error('❌ Exception in completeTask:', error);
      return false;
    }
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