// Legacy exports - deprecated, use supabase-auth instead
export { AuthProvider, useAuth } from './context';
export { useEnhancedAuth } from './enhanced-auth';
export type { User, AuthContextType } from './context';

// New Supabase auth exports
export { SupabaseAuthProvider, useSupabaseAuth } from './supabase-auth';
export type { UserProfile } from './supabase-auth';
