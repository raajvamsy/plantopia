// Enhanced Supabase Services Index
// Exports all service classes for the Plantopia PWA

export { UserService } from './users';
export { PlantService } from './plants';
export { TaskService } from './tasks';
export { CommunityService } from './community';
export { MessageService } from './messages';
export { AchievementService } from './achievements';
export { AIService } from './ai';

// Re-export types for convenience
export type {
  User,
  UserInsert,
  UserInsertWithId,
  UserUpdate,
  Plant,
  PlantInsert,
  PlantUpdate,
  Task,
  TaskInsert,
  TaskUpdate,
  Post,
  PostInsert,
  PostUpdate,
  Comment,
  CommentInsert,
  CommentUpdate,
  Message,
  MessageInsert,
  MessageUpdate,
  Achievement,
  AchievementInsert,
  AchievementUpdate,
  AIInteraction,
  AIInteractionInsert,
  AIInteractionUpdate,
  PlantCareLog,
  PlantCareLogInsert,
  ConversationSummary,
  PostWithUser,
  CommentWithUser,
  MessageWithUsers,
  PlantStats,
  TaskStats,
  AchievementStats,
  MessageStats,
  PostStats,
  AIInteractionType,
  TaskStatus,
  TaskPriority,
  TaskType,
  PlantCategory
} from '@/types/api';