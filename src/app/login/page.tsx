'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { useThemeColors } from '@/lib/theme/hooks';
import { cn } from '@/lib/utils';
import { MobileCheckbox, Label } from '@/components/ui';
import { 
  AuthGuard, 
  FormInput, 
  PrimaryButton, 
  ErrorMessage 
} from '@/components/common';
import { useForm } from '@/hooks/use-form';

interface LoginFormData extends Record<string, unknown> {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const { login } = useSupabaseAuth();
  const themeColors = useThemeColors();
  
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string>('');

  const { data, errors, isSubmitting, setField, setErrors, handleSubmit } = useForm<LoginFormData>({
    initialData: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: (data) => {
      const newErrors: Partial<Record<keyof LoginFormData, string>> = {};
      
      if (!data.email) {
        newErrors.email = 'Email is required';
      }
      
      if (!data.password) {
        newErrors.password = 'Password is required';
      } else if (data.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      return newErrors;
    },
    onSubmit: async (data) => {
      const result = await login(data.email, data.password, data.rememberMe);
      
      if (!result.success) {
        setGeneralError(result.error || 'Login failed');
        throw new Error(result.error || 'Login failed');
      }
    },
  });

  return (
    <AuthGuard requireAuth={false}>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-3 sm:p-4 bg-muted/30 safe-area-inset">
        {/* Background watermark */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Login Form */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6 rounded-2xl sm:rounded-3xl bg-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md border border-border">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Welcome Back!</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">Let&apos;s get back to growing.</p>
          </div>

          {generalError && (
            <ErrorMessage 
              message={generalError} 
              onDismiss={() => setGeneralError('')}
              dismissible
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email/Username Input */}
            <FormInput
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              required
              value={data.email}
              onChange={(e) => setField('email', e.target.value)}
              error={errors.email}
              placeholder="Email or Username"
            />

            {/* Password Input */}
            <FormInput
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={data.password}
              onChange={(e) => setField('password', e.target.value)}
              error={errors.password}
              placeholder="Password"
              isPassword
              showPassword={showPassword}
              showPasswordToggle
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-3">
                <MobileCheckbox
                  id="remember-me"
                  checked={data.rememberMe}
                  onCheckedChange={(checked) => setField('rememberMe', checked)}
                  aria-label="Remember me"
                />
                <Label 
                  htmlFor="remember-me" 
                  className="text-sm sm:text-sm text-muted-foreground cursor-pointer select-none leading-none"
                >
                  Remember me
                </Label>
              </div>
              <Link 
                href="/forgot-password" 
                className="text-xs sm:text-sm font-medium hover:underline"
                style={{ color: themeColors.sage }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <PrimaryButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Logging In..."
              fullWidth
            >
              Log In
            </PrimaryButton>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link 
              href="/signup" 
              className="font-bold hover:underline"
              style={{ color: themeColors.sage }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
