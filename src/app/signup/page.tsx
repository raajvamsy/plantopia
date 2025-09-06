'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { useThemeColors } from '@/lib/theme/hooks';
import { 
  AuthGuard, 
  FormInput, 
  PasswordInput,
  PrimaryButton, 
  ErrorMessage 
} from '@/components/common';
import { useForm } from '@/hooks/use-form';

interface SignupFormData extends Record<string, unknown> {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const { signup } = useSupabaseAuth();
  const themeColors = useThemeColors();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string>('');

  const { data, errors, isSubmitting, setField, setErrors, handleSubmit } = useForm<SignupFormData>({
    initialData: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    validate: (data) => {
      const newErrors: Partial<Record<keyof SignupFormData, string>> = {};

      // Email validation
      if (!data.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        newErrors.email = 'Please enter a valid email';
      }

      // Username validation
      if (!data.username) {
        newErrors.username = 'Username is required';
      } else if (data.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }

      // Password validation
      if (!data.password) {
        newErrors.password = 'Password is required';
      } else if (data.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      // Confirm password validation
      if (!data.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (data.password !== data.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      return newErrors;
    },
    onSubmit: async (data) => {
      const result = await signup(data.email, data.password, data.username, data.username);
      
      if (!result.success) {
        setGeneralError(result.error || 'Signup failed');
        throw new Error(result.error || 'Signup failed');
      }
    },
  });

  // Real-time password matching validation
  const handlePasswordChange = (value: string) => {
    setField('password', value);
    
    // Check confirm password if it exists
    if (data.confirmPassword && value && data.confirmPassword !== value) {
      setErrors({ confirmPassword: 'Passwords do not match' });
    } else if (data.confirmPassword && value && data.confirmPassword === value) {
      setErrors({ confirmPassword: undefined });
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setField('confirmPassword', value);
    
    // Real-time validation
    if (value && data.password && value !== data.password) {
      setErrors({ confirmPassword: 'Passwords do not match' });
    } else if (value && data.password && value === data.password) {
      setErrors({ confirmPassword: undefined });
    }
  };

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
        
        {/* Signup Form */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6 rounded-2xl sm:rounded-3xl bg-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md border border-border">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Join Plantopia!</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">Start your plant journey today.</p>
          </div>

          {generalError && (
            <ErrorMessage 
              message={generalError} 
              onDismiss={() => setGeneralError('')}
              dismissible
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email Input */}
            <FormInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={data.email}
              onChange={(e) => setField('email', e.target.value)}
              error={errors.email}
              placeholder="Email"
            />

            {/* Username Input */}
            <FormInput
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={data.username}
              onChange={(e) => setField('username', e.target.value)}
              error={errors.username}
              placeholder="Username"
            />

            {/* Password Input with Strength Indicator */}
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              required
              value={data.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              error={errors.password}
              placeholder="Password"
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              showStrength={true}
            />

            {/* Confirm Password Input with Matching Indicator */}
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              required
              value={data.confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              error={errors.confirmPassword}
              placeholder="Confirm Password"
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              matchPassword={data.password}
              showMatchIndicator={true}
              successMessage="Passwords match"
            />

            {/* Submit Button */}
            <PrimaryButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Creating Account..."
              fullWidth
            >
              Sign Up
            </PrimaryButton>
          </form>

          {/* Login Link */}
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-bold hover:underline"
              style={{ color: themeColors.sage }}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}