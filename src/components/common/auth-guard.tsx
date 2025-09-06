'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import LoadingSpinner from './loading-spinner';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

export function AuthGuard({ 
  children, 
  redirectTo = '/login', 
  requireAuth = true,
  fallback = null 
}: AuthGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useSupabaseAuth();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, router, requireAuth, redirectTo]);

  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
    // return <FullPageLoader message="Checking authentication..." />;
  }

  if (requireAuth && !isAuthenticated) {
    return fallback;
  }

  if (!requireAuth && isAuthenticated) {
    return fallback;
  }

  return <>{children}</>;
}

export default AuthGuard;
