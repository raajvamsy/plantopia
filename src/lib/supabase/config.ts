import { createClient } from '@supabase/supabase-js';

// Import types from our centralized API types
import type {
  User,
  UserInsert,
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
  Like,
  LikeInsert,
  Follower,
  FollowerInsert,
  Message,
  MessageInsert,
  MessageUpdate,
  Achievement,
  AchievementInsert,
  AchievementUpdate,
  PlantCareLog,
  PlantCareLogInsert,
} from '@/types/api';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug environment variables
console.log('🔍 Environment Variables Debug:', {
  NODE_ENV: process.env.NODE_ENV,
  supabaseUrl: supabaseUrl,
  supabaseUrlType: typeof supabaseUrl,
  supabaseAnonKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined',
  supabaseAnonKeyType: typeof supabaseAnonKey,
  allEnvKeys: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
});

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}. Must be a valid URL.`);
}

// Validate anon key format (should be a JWT token)
if (!supabaseAnonKey.startsWith('eyJ')) {
  console.error('⚠️ Invalid anon key format. Expected JWT token starting with "eyJ"');
  console.error('🔑 Current key starts with:', supabaseAnonKey.substring(0, 10));
  throw new Error('Invalid NEXT_PUBLIC_SUPABASE_ANON_KEY format. Should be a JWT token starting with "eyJ".');
}

console.log('🔧 Supabase Config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey.length
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      plants: {
        Row: Plant;
        Insert: PlantInsert;
        Update: PlantUpdate;
      };
      tasks: {
        Row: Task;
        Insert: TaskInsert;
        Update: TaskUpdate;
      };
      posts: {
        Row: Post;
        Insert: PostInsert;
        Update: PostUpdate;
      };
      comments: {
        Row: Comment;
        Insert: CommentInsert;
        Update: CommentUpdate;
      };
      likes: {
        Row: Like;
        Insert: LikeInsert;
        Update: Partial<Like>;
      };
      followers: {
        Row: Follower;
        Insert: FollowerInsert;
        Update: Partial<Follower>;
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: MessageUpdate;
      };
      achievements: {
        Row: Achievement;
        Insert: AchievementInsert;
        Update: AchievementUpdate;
      };
      plant_care_logs: {
        Row: PlantCareLog;
        Insert: PlantCareLogInsert;
        Update: Partial<PlantCareLog>;
      };
    };
  };
};
