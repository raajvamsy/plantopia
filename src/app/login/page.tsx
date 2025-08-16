'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useThemeColors, usePlantColors } from '@/lib/theme/hooks';
import { cn } from '@/lib/utils';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Label from '@radix-ui/react-label';
import { CheckIcon, EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const themeColors = useThemeColors();
  const plantColors = usePlantColors();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard'); // or wherever you want to redirect
    }
  }, [isAuthenticated, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email) && formData.email.length < 3) {
      newErrors.email = 'Please enter a valid email or username';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password, formData.rememberMe);
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setErrors({ general: result.error || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} style={{ color: themeColors.sage }} />
      </div>
    );
  }

  return (
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
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">Let's get back to growing.</p>
        </div>

        {errors.general && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive text-center border border-destructive/20">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Email/Username Input */}
          <div>
            <Label.Root htmlFor="email" className="sr-only">
              Email or Username
            </Label.Root>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={cn(
                "block w-full rounded-full border-2 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg transition duration-300",
                "bg-muted/50 text-foreground placeholder-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                errors.email 
                  ? "border-destructive focus:border-destructive focus:ring-destructive" 
                  : "border-transparent focus:border-primary focus:ring-primary",
              )}
              placeholder="Email or Username"
            />
            {errors.email && (
              <p className="mt-1 text-xs sm:text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <Label.Root htmlFor="password" className="sr-only">
              Password
            </Label.Root>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={cn(
                "block w-full rounded-full border-2 px-4 sm:px-5 py-3 sm:py-4 pr-10 sm:pr-12 text-base sm:text-lg transition duration-300 relative z-10",
                "bg-muted/50 text-foreground placeholder-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                errors.password 
                  ? "border-destructive focus:border-destructive focus:ring-destructive" 
                  : "border-transparent focus:border-primary focus:ring-primary",
              )}
              placeholder="Password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 z-20"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              ) : (
                <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-xs sm:text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox.Root
                id="remember-me"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => handleInputChange('rememberMe', checked === true)}
                className={cn(
                  "flex h-4 w-8 sm:h-5 sm:w-5 items-center justify-center rounded border-2 transition-colors",
                  "data-[state=checked]:text-primary-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                )}
                style={{
                  borderColor: formData.rememberMe ? themeColors.sage : themeColors.border,
                  backgroundColor: formData.rememberMe ? themeColors.sage : 'transparent',
                }}
              >
                <Checkbox.Indicator>
                  <CheckIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" style={{ color: themeColors.primaryForeground }} />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <Label.Root 
                htmlFor="remember-me" 
                className="text-xs sm:text-sm text-muted-foreground cursor-pointer"
              >
                Remember me
              </Label.Root>
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
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "flex w-full justify-center items-center rounded-full px-4 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-lg min-h-[44px]",
              "transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
              "text-white"
            )}
            style={{ 
              backgroundColor: themeColors.sage,
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Logging In...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          Don't have an account?{' '}
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
  );
}
