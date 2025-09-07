'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabase/config';
import { UserService } from '../supabase/services';
import type { AuthResponse, User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  level: number;
  experience_points: number;
  water_droplets: number;
}

export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, username: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const SupabaseAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced timeout wrapper for auth operations
  const withTimeout = async <T,>(
    promise: Promise<T>, 
    timeoutMs: number = 10000,
    operation: string = 'operation'
  ): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs)
    );
    
    try {
      return await Promise.race([promise, timeoutPromise]);
    } catch (error) {
      console.error(`${operation} failed:`, error);
      throw error;
    }
  };

  // Enhanced profile loading with better error handling
  const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('🔍 Loading profile for user:', userId);
      
      const profile = await withTimeout(
        UserService.getCurrentUser(),
        8000,
        'Profile load'
      );
      
      if (profile) {
        console.log('✅ Profile loaded successfully:', profile.username);
        setUser(profile as UserProfile);
        return profile as UserProfile;
      } else {
        console.warn('⚠️  No profile found for user:', userId);
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      throw error;
    }
  };

  // Improved profile recovery with better error handling
  const recoverUserProfile = async (authUser: User): Promise<UserProfile | null> => {
    try {
      console.log('🔄 Starting profile recovery for user:', authUser.id, 'email:', authUser.email);
      
      // Strategy 1: Check for orphaned profile by email
      try {
        if (!authUser.email) {
          console.log('⚠️  No email available for profile recovery');
          return null;
        }
        
        const existingProfile = await withTimeout(
          UserService.getUserByEmail(authUser.email),
          5000,
          'Email profile lookup'
        );
        
        if (existingProfile && existingProfile.id !== authUser.id) {
          console.log('⚠️  Found orphaned profile:', {
            authUserId: authUser.id,
            profileUserId: existingProfile.id,
            email: authUser.email,
            username: existingProfile.username
          });
          
          // Try to fix the orphaned profile
          try {
            const fixedProfile = await withTimeout(
              UserService.fixOrphanedProfile(existingProfile.id, authUser.id),
              5000,
              'Profile fix'
            );
            
            if (fixedProfile) {
              console.log('✅ Successfully fixed orphaned profile');
              return fixedProfile as UserProfile;
            }
          } catch (fixError) {
            console.error('❌ Failed to fix orphaned profile:', fixError);
          }
          
          // If fixing fails, create new profile with unique username
          const uniqueUsername = `${existingProfile.username}_${Date.now()}`;
          console.log('🆕 Creating new profile with unique username:', uniqueUsername);
          
          const newProfile = await withTimeout(
            UserService.createUserWithId({
              id: authUser.id,
              email: authUser.email,
              username: uniqueUsername,
              full_name: existingProfile.full_name,
              level: 1,
              experience_points: 0,
              water_droplets: 100,
            }),
            5000,
            'New profile creation'
          );
          
          if (newProfile) {
            console.log('✅ Created new profile successfully');
            return newProfile as UserProfile;
          }
        }
      } catch (emailCheckError) {
        console.log('ℹ️  No existing profile found for email, proceeding with new profile creation');
      }
      
      // Strategy 2: Create completely new profile
      const username = authUser.user_metadata?.username || 
                      authUser.email?.split('@')[0] || 
                      `user_${Date.now()}`;
      
      const fullName = (authUser.user_metadata?.full_name as string) || null;
      
      console.log('🆕 Creating new profile for auth user:', authUser.id);
      
      if (!authUser.email) {
        console.error('❌ Cannot create profile without email');
        return null;
      }
      
      const recoveredProfile = await withTimeout(
        UserService.createUserWithId({
          id: authUser.id,
          email: authUser.email,
          username,
          full_name: fullName!,
          level: 1,
          experience_points: 0,
          water_droplets: 100,
        }),
        8000,
        'Profile recovery creation'
      );
      
      if (recoveredProfile) {
        console.log('✅ Profile recovery successful');
        return recoveredProfile as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Profile recovery failed:', error);
      return null;
    }
  };

  // Enhanced auth state initialization
  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing auth state...');
        
        const { data: { session } } = await withTimeout(
          supabase.auth.getSession(),
          8000,
          'Initial session check'
        );
        
        if (!isMounted) return;
        
        if (session?.user) {
          console.log('🔐 Found existing session for user:', session.user.id);
          try {
            const profile = await loadUserProfile(session.user.id);
            if (!profile && isMounted) {
              console.warn('⚠️  Session exists but no profile found, attempting recovery...');
              const recoveredProfile = await recoverUserProfile(session.user);
              if (recoveredProfile && isMounted) {
                setUser(recoveredProfile);
              } else if (isMounted) {
                console.error('❌ Profile recovery failed, signing out user');
                await supabase.auth.signOut();
                setUser(null);
              }
            }
          } catch (profileError) {
            if (isMounted) {
              console.error('❌ Profile load failed during initialization:', profileError);
              await supabase.auth.signOut();
              setUser(null);
            }
          }
        } else {
          console.log('ℹ️  No existing session found');
        }
      } catch (error) {
        if (isMounted) {
          console.error('❌ Auth initialization failed:', error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Enhanced auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('🔄 Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const profile = await loadUserProfile(session.user.id);
            if (!profile && isMounted) {
              console.warn('⚠️  Sign in successful but no profile found, attempting recovery...');
              const recoveredProfile = await recoverUserProfile(session.user);
              if (recoveredProfile && isMounted) {
                setUser(recoveredProfile);
              } else if (isMounted) {
                console.error('❌ Profile recovery failed after sign in');
                await supabase.auth.signOut();
                setUser(null);
              }
            }
          } catch (profileError) {
            if (isMounted) {
              console.error('❌ Profile load failed after sign in:', profileError);
              await supabase.auth.signOut();
              setUser(null);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          if (isMounted) {
            setUser(null);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed');
        }
        
        if (isMounted) {
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Enhanced login with better error handling
  const login = useCallback(async (
    email: string, 
    password: string, 
    _rememberMe: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      console.log('🔐 Attempting login for:', email);
      
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        10000,
        'Login'
      );

      if (error) {
        console.error('❌ Login error:', error);
        
        // Enhanced error messages
        let userFriendlyMessage = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          userFriendlyMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          userFriendlyMessage = 'Please check your email and click the confirmation link before logging in.';
        } else if (error.message.includes('Too many requests')) {
          userFriendlyMessage = 'Too many login attempts. Please wait a moment and try again.';
        } else if (error.message.includes('Network') || error.message.includes('timeout')) {
          userFriendlyMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('Invalid API key')) {
          userFriendlyMessage = 'Service temporarily unavailable. Please try again later.';
        }
        
        return { success: false, error: userFriendlyMessage };
      }

      if (data.user) {
        console.log('✅ Login successful for user:', data.user.id);
        // Profile loading will be handled by the auth state change listener
        return { success: true };
      }

      return { success: false, error: 'Login failed - no user data received' };
    } catch (error) {
      console.error('❌ Login exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      if (errorMessage.includes('timeout')) {
        return { success: false, error: 'Login is taking too long. Please check your connection and try again.' };
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enhanced signup with better error handling and validation
  const signup = useCallback(async (
    email: string, 
    password: string, 
    username: string,
    fullName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      console.log('📝 Attempting signup for:', email, 'username:', username);
      
      // Pre-validate username availability
      try {
        const existingUser = await withTimeout(
          UserService.getUserByUsername(username),
          5000,
          'Username check'
        );
        
        if (existingUser) {
          return { success: false, error: 'Username already taken. Please choose a different username.' };
        }
      } catch (checkError) {
        console.warn('⚠️  Username availability check failed, proceeding with signup:', checkError);
      }

      // Check if user already exists
      try {
        const { data: existingAuthUser } = await withTimeout(
          supabase.auth.signInWithPassword({ email, password }),
          5000,
          'Existing user check'
        );
        
        if (existingAuthUser.user) {
          // User exists in auth, try to recover their profile
          await supabase.auth.signOut(); // Sign out the test login
          
          try {
            const profile = await loadUserProfile(existingAuthUser.user.id);
            if (profile) {
              return { success: false, error: 'Account already exists. Please login instead.' };
            } else {
              // Profile doesn't exist, recover it
              const recoveredProfile = await recoverUserProfile(existingAuthUser.user);
              if (recoveredProfile) {
                setUser(recoveredProfile);
                return { success: true };
              }
            }
          } catch (profileError) {
            console.warn('⚠️  Profile recovery during signup failed:', profileError);
          }
        }
      } catch (existingUserError) {
        // User doesn't exist, continue with signup
        console.log('ℹ️  User does not exist, proceeding with signup');
      }

      // Create new auth user
      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              full_name: fullName,
            }
          }
        }),
        15000,
        'Signup'
      );

      if (error) {
        console.error('❌ Signup error:', error);
        
        if (error.message.includes('User already registered')) {
          return { success: false, error: 'Account already exists. Please login instead.' };
        } else if (error.message.includes('Password should be at least')) {
          return { success: false, error: 'Password must be at least 6 characters long.' };
        } else if (error.message.includes('Invalid email')) {
          return { success: false, error: 'Please enter a valid email address.' };
        } else if (error.message.includes('Signup is disabled')) {
          return { success: false, error: 'Account creation is temporarily disabled. Please try again later.' };
        }
        
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('✅ Auth user created:', data.user.id);
        
        // Create user profile with retry logic
        let profile = null;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (!profile && attempts < maxAttempts) {
          attempts++;
          try {
            console.log(`📝 Profile creation attempt ${attempts}/${maxAttempts}`);
            
            profile = await withTimeout(
              UserService.createUserWithId({
                id: data.user.id,
                email: data.user.email!,
                username,
                full_name: fullName || null,
                level: 1,
                experience_points: 0,
                water_droplets: 100,
              }),
              8000,
              `Profile creation attempt ${attempts}`
            );
            
            if (profile) {
              console.log('✅ Profile created successfully on attempt', attempts);
              setUser(profile);
              break;
            }
          } catch (profileError) {
            console.warn(`❌ Profile creation attempt ${attempts} failed:`, profileError);
            
            if (attempts < maxAttempts) {
              // Exponential backoff
              await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts - 1)));
            }
          }
        }

        if (profile) {
          return { success: true };
        } else {
          console.warn('⚠️  All profile creation attempts failed, but auth user was created');
          // Don't fail the signup - user can login later and profile will be recovered
          return { 
            success: true, 
            error: 'Account created successfully! Please check your email to verify your account, then login.' 
          };
        }
      }

      return { success: false, error: 'Signup failed - no user data received' };
    } catch (error) {
      console.error('❌ Signup exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      if (errorMessage.includes('timeout')) {
        return { success: false, error: 'Signup is taking too long. Please check your connection and try again.' };
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enhanced logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      console.log('👋 Logging out user');
      await withTimeout(supabase.auth.signOut(), 5000, 'Logout');
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force clear user state even if logout fails
      setUser(null);
    }
  }, []);

  // Enhanced forgot password
  const forgotPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔑 Sending password reset email to:', email);
      
      const { error } = await withTimeout(
        supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        }),
        10000,
        'Password reset'
      );

      if (error) {
        console.error('❌ Password reset error:', error);
        
        if (error.message.includes('Invalid email')) {
          return { success: false, error: 'Please enter a valid email address.' };
        } else if (error.message.includes('Email rate limit exceeded')) {
          return { success: false, error: 'Too many password reset attempts. Please wait before trying again.' };
        }
        
        return { success: false, error: error.message };
      }

      console.log('✅ Password reset email sent');
      return { success: true };
    } catch (error) {
      console.error('❌ Password reset exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      if (errorMessage.includes('timeout')) {
        return { success: false, error: 'Request is taking too long. Please check your connection and try again.' };
      }
      
      return { success: false, error: errorMessage };
    }
  }, []);

  // Enhanced profile update
  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('📝 Updating profile for user:', user.id);
      
      const updatedProfile = await withTimeout(
        UserService.updateUser(user.id, updates),
        8000,
        'Profile update'
      );
      
      if (updatedProfile) {
        console.log('✅ Profile updated successfully');
        setUser(updatedProfile);
        return { success: true };
      }

      return { success: false, error: 'Failed to update profile' };
    } catch (error) {
      console.error('❌ Profile update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      if (errorMessage.includes('timeout')) {
        return { success: false, error: 'Update is taking too long. Please check your connection and try again.' };
      }
      
      return { success: false, error: errorMessage };
    }
  }, [user]);

  // Manual profile refresh
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!user) return;
    
    try {
      console.log('🔄 Refreshing profile for user:', user.id);
      await loadUserProfile(user.id);
    } catch (error) {
      console.error('❌ Profile refresh failed:', error);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    forgotPassword,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};