// API Types and Interfaces for Plantopia PWA
// This file contains all the TypeScript interfaces and types used across the application

// ============================================================================
// DATABASE ENUMS (from Supabase schema)
// ============================================================================

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskType = 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'other';
export type PlantCategory = 'indoor' | 'outdoor' | 'succulent' | 'herb' | 'flower' | 'vegetable' | 'tree' | 'other';

// ============================================================================
// BASE DATABASE TYPES (from Supabase config)
// ============================================================================

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
  last_seen: string | null;
  is_online: boolean;
  level: number;
  experience_points: number;
  water_droplets: number;
}

export interface UserInsert {
  id?: string;
  email: string;
  username: string;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  created_at?: string;
  updated_at?: string;
  last_seen?: string | null;
  is_online?: boolean;
  level?: number;
  experience_points?: number;
  water_droplets?: number;
}

export interface UserUpdate {
  id?: string;
  email?: string;
  username?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  created_at?: string;
  updated_at?: string;
  last_seen?: string | null;
  is_online?: boolean;
  level?: number;
  experience_points?: number;
  water_droplets?: number;
}

export interface Plant {
  id: string;
  user_id: string;
  name: string;
  species: string | null;
  category: PlantCategory;
  image_url: string | null;
  health: number;
  moisture: number;
  sunlight: number;
  level: number;
  experience_points: number;
  is_archived: boolean;
  planted_date: string | null;
  last_watered: string | null;
  last_fertilized: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlantInsert {
  id?: string;
  user_id: string;
  name: string;
  species?: string | null;
  category: PlantCategory;
  image_url?: string | null;
  health?: number;
  moisture?: number;
  sunlight?: number;
  level?: number;
  experience_points?: number;
  is_archived?: boolean;
  planted_date?: string | null;
  last_watered?: string | null;
  last_fertilized?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PlantUpdate {
  id?: string;
  user_id?: string;
  name?: string;
  species?: string | null;
  category?: PlantCategory;
  image_url?: string | null;
  health?: number;
  moisture?: number;
  sunlight?: number;
  level?: number;
  experience_points?: number;
  is_archived?: boolean;
  planted_date?: string | null;
  last_watered?: string | null;
  last_fertilized?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  user_id: string;
  plant_id: string | null;
  title: string;
  description: string | null;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskInsert {
  id?: string;
  user_id: string;
  plant_id?: string | null;
  title: string;
  description?: string | null;
  type: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TaskUpdate {
  id?: string;
  user_id?: string;
  plant_id?: string | null;
  title?: string;
  description?: string | null;
  type?: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface PostInsert {
  id?: string;
  user_id: string;
  content: string;
  image_url?: string | null;
  likes_count?: number;
  comments_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PostUpdate {
  id?: string;
  user_id?: string;
  content?: string;
  image_url?: string | null;
  likes_count?: number;
  comments_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CommentInsert {
  id?: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommentUpdate {
  id?: string;
  post_id?: string;
  user_id?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface LikeInsert {
  id?: string;
  user_id: string;
  post_id: string;
  created_at?: string;
}

export interface Follower {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface FollowerInsert {
  id?: string;
  follower_id: string;
  following_id: string;
  created_at?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface MessageInsert {
  id?: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read?: boolean;
  created_at?: string;
}

export interface MessageUpdate {
  id?: string;
  sender_id?: string;
  receiver_id?: string;
  content?: string;
  is_read?: boolean;
  created_at?: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface AchievementInsert {
  id?: string;
  user_id: string;
  achievement_type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  completed?: boolean;
  completed_at?: string | null;
  created_at?: string;
}

export interface AchievementUpdate {
  id?: string;
  user_id?: string;
  achievement_type?: string;
  title?: string;
  description?: string;
  icon?: string;
  color?: string;
  completed?: boolean;
  completed_at?: string | null;
  created_at?: string;
}

export interface PlantCareLog {
  id: string;
  plant_id: string;
  user_id: string;
  action: string;
  details: string | null;
  created_at: string;
}

export interface PlantCareLogInsert {
  id?: string;
  plant_id: string;
  user_id: string;
  action: string;
  details?: string | null;
  created_at?: string;
}

// ============================================================================
// EXTENDED TYPES WITH RELATIONS (used in API responses)
// ============================================================================

export interface PostWithUser extends Post {
  users: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface CommentWithUser extends Comment {
  users: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface MessageWithUsers extends Message {
  sender: User;
  receiver: User;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ConversationSummary {
  otherUser: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
    is_online?: boolean;
  };
  lastMessage: Message;
  unreadCount: number;
}

export interface PlantStats {
  totalPlants: number;
  healthyPlants: number;
  plantsNeedingWater: number;
  plantsNeedingAttention: number;
  averageHealth: number;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface AchievementStats {
  totalAchievements: number;
  completedAchievements: number;
  pendingAchievements: number;
  completionRate: number;
}

export interface MessageStats {
  totalMessages: number;
  unreadMessages: number;
  conversationsCount: number;
}

export interface PostStats {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface PlantCardProps {
  id: string;
  name: string;
  health: number;
  moisture: number;
  sunlight: number;
  imageUrl: string;
  onClick?: () => void;
  className?: string;
}

export interface TaskItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  completed: boolean;
  onClick?: () => void;
}

export interface UserAvatarProps {
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
    is_online?: boolean;
  };
  size?: 'sm' | 'md' | 'lg';
  showOnlineStatus?: boolean;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
}

export interface PlantForm {
  name: string;
  species?: string;
  category: PlantCategory;
  image_url?: string;
  planted_date?: string;
  notes?: string;
}

export interface TaskForm {
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  due_date?: string;
  plant_id?: string;
}

export interface PostForm {
  content: string;
  image_url?: string;
}

export interface MessageForm {
  content: string;
  receiver_id: string;
}

export interface ProfileForm {
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
}

// ============================================================================
// FILTER AND SEARCH TYPES
// ============================================================================

export interface PlantFilters {
  category?: PlantCategory | 'all';
  health?: 'healthy' | 'needs_attention' | 'all';
  moisture?: 'well_watered' | 'needs_water' | 'all';
  archived?: boolean;
}

export interface TaskFilters {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  type?: TaskType | 'all';
  plant_id?: string;
  overdue?: boolean;
}

export interface PostFilters {
  category?: string;
  user_id?: string;
  following_only?: boolean;
}

export interface SearchParams {
  query: string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
  nextOffset?: number;
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// ============================================================================
// THEME TYPES
// ============================================================================

export interface PlantColors {
  sage: string;
  mint: string;
  forest: string;
  earth: string;
  sunshine: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ============================================================================
// API SERVICE RESPONSE TYPES
// ============================================================================

export type ServiceResponse<T> = T | null;
export type ServiceListResponse<T> = T[];
export type ServiceBooleanResponse = boolean;

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface DashboardData {
  plants: Plant[];
  tasks: Task[];
  achievements: Achievement[];
  stats: {
    plants: PlantStats;
    tasks: TaskStats;
    achievements: AchievementStats;
  };
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  id: string;
  type: 'achievement' | 'task_reminder' | 'plant_care' | 'social';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

// All types are already exported as interfaces above
// No need for additional export type block
