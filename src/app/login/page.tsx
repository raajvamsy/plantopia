'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useEnhancedAuth } from '@/lib/auth';
import { useThemeColors, usePlantColors } from '@/lib/theme/hooks';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon, Loader2, CheckIcon } from 'lucide-react';
import { Button, Input, MobileCheckbox, Label } from '@/components/ui';
import AuthLoading from '@/components/auth/auth-loading';

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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const enhancedAuth = useEnhancedAuth();
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

    // Very lenient validation for demo purposes
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      console.log('Form submitting with:', { email: formData.email, password: '***', passwordLength: formData.password.length });
      const result = await enhancedAuth.login(formData.email, formData.password, formData.rememberMe) as { success: boolean; error?: string };
      
      // if (result.success) {
        router.push('/dashboard');
      // } else {
      //   setErrors({ general: result.error || 'Login failed' });
      // }
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
    return <AuthLoading message="Checking authentication..." subMessage="Please wait while we verify your session" />;
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
            <Label htmlFor="email" className="sr-only">
              Email or Username
            </Label>
            <Input
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={cn(
                "rounded-full border-2 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg",
                "bg-muted/50",
                errors.email 
                  ? "border-destructive focus-visible:ring-destructive" 
                  : "border-transparent",
              )}
              placeholder="Email or Username"
            />
            {errors.email && (
              <p className="mt-1 text-xs sm:text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={cn(
                "rounded-full border-2 px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 text-base sm:text-lg relative z-10",
                "bg-muted/50",
                errors.password 
                  ? "border-destructive focus-visible:ring-destructive" 
                  : "border-transparent",
              )}
              placeholder="Password"
            />
            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-3 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 hover:opacity-70 transition-opacity z-20"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 sm:h-5 sm:w-5 text-muted-foreground" />
              ) : (
                <EyeIcon className="h-5 w-5 sm:h-5 sm:w-5 text-muted-foreground" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-xs sm:text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-3">
              <MobileCheckbox
                id="remember-me"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => handleInputChange('rememberMe', checked)}
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
