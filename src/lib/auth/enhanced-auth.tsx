'use client';

import React, { useContext } from 'react';
import { useAuth } from './context';
import { useLoading, LoadingContext } from '@/lib/loading';

// Enhanced auth hooks that integrate with the global loading system
export function useEnhancedAuth() {
  const auth = useAuth();
  const loadingContext = useContext(LoadingContext);
  
  // If no loading context, fall back to direct auth functions
  if (!loadingContext) {
    console.warn('useEnhancedAuth: LoadingProvider not found, using direct auth functions');
    return auth;
  }
  
  const { withLoading } = loadingContext;

  const enhancedLogin = async (
    email: string, 
    password: string, 
    rememberMe: boolean = false
  ) => {
    console.log('Enhanced login called with:', { email, password: '***' });
    try {
      const result = await withLoading(
        auth.login(email, password, rememberMe),
        'Signing you in...',
        'Authenticating your credentials'
      );
      console.log('Enhanced login result:', result);
      return result;
    } catch (error) {
      console.error('Enhanced login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const enhancedSignup = async (
    email: string, 
    password: string, 
    username: string
  ) => {
    return withLoading(
      () => auth.signup(email, password, username),
      'Creating your account...',
      'Setting up your digital garden'
    );
  };

  const enhancedForgotPassword = async (email: string) => {
    return withLoading(
      () => auth.forgotPassword(email),
      'Sending reset email...',
      'Please check your inbox'
    );
  };

  const enhancedLogout = async () => {
    return withLoading(
      async () => {
        // Add a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        await auth.logout();
      },
      'Signing you out...',
      'Saving your session'
    );
  };

  return {
    ...auth,
    login: enhancedLogin,
    signup: enhancedSignup,
    forgotPassword: enhancedForgotPassword,
    logout: enhancedLogout,
  };
}

