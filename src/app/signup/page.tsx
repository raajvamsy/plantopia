'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useThemeColors } from '@/lib/theme/hooks';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon, Loader2, Check, X } from 'lucide-react';
import { PasswordStrength } from '@/components/ui/password-strength';

interface FormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading: authLoading } = useAuth();
  const themeColors = useThemeColors();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const result = await signup(formData.email, formData.password, formData.username);
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setErrors({ general: result.error || 'Signup failed' });
      }
    } catch {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear existing error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Real-time password matching validation
    if (field === 'confirmPassword') {
      const currentPassword = formData.password;
      if (value && currentPassword && value !== currentPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else if (value && currentPassword && value === currentPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
      }
    }
    
    // Also check confirm password when main password changes
    if (field === 'password') {
      const currentConfirmPassword = formData.confirmPassword;
      if (currentConfirmPassword && value && currentConfirmPassword !== value) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else if (currentConfirmPassword && value && currentConfirmPassword === value) {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
      }
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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 bg-muted/30">
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10 w-full max-w-md space-y-6 rounded-3xl bg-card/90 p-8 shadow-2xl backdrop-blur-md border border-border">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Join Plantopia!</h1>
          <p className="mt-2 text-muted-foreground">Start your plant journey today.</p>
        </div>

        {errors.general && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive text-center border border-destructive/20">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={cn(
                "block w-full rounded-full border-2 px-5 py-4 text-lg transition duration-300",
                "bg-muted/50 text-foreground placeholder-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                errors.email 
                  ? "border-destructive focus:border-destructive focus:ring-destructive" 
                  : "border-transparent focus:border-primary focus:ring-primary",
              )}
              placeholder="Email"
            />
            {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
          </div>

          <div>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={cn(
                "block w-full rounded-full border-2 px-5 py-4 text-lg transition duration-300",
                "bg-muted/50 text-foreground placeholder-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                errors.username 
                  ? "border-destructive focus:border-destructive focus:ring-destructive" 
                  : "border-transparent focus:border-primary focus:ring-primary",
              )}
              placeholder="Username"
            />
            {errors.username && <p className="mt-1 text-sm text-destructive">{errors.username}</p>}
          </div>

          <div className="space-y-0">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={cn(
                  "block w-full rounded-full border-2 px-5 py-4 pr-12 text-lg transition duration-300 relative z-10",
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
                className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center justify-center w-8 h-8 hover:opacity-70 transition-opacity z-20"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
            
            {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password}</p>}
            
            {/* Password Strength Indicator */}
            <PasswordStrength password={formData.password} />
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={cn(
                "block w-full rounded-full border-2 px-5 py-4 text-lg transition duration-300 relative z-10",
                "bg-muted/50 text-foreground placeholder-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                // Dynamic styling based on password match status
                errors.confirmPassword 
                  ? "border-destructive focus:border-destructive focus:ring-destructive" 
                  : formData.confirmPassword && formData.password && formData.confirmPassword === formData.password
                  ? ""
                  : "border-transparent focus:border-primary focus:ring-primary",
                // Add consistent right padding for icons
                formData.confirmPassword && formData.password ? "pr-24" : "pr-12",
              )}
              style={{
                ...(formData.confirmPassword && formData.password && formData.confirmPassword === formData.password && !errors.confirmPassword ? {
                  borderColor: themeColors.sage,
                  '--tw-ring-color': themeColors.sage,
                } : {})
              }}
              placeholder="Confirm Password"
            />
            
            {/* Password Match Indicator */}
            {formData.confirmPassword && formData.password && (
              <div className="absolute top-1/3 -translate-y-1/3 right-12 flex items-center justify-center w-8 h-8 z-20 pointer-events-none">
                {formData.confirmPassword === formData.password ? (
                  <Check className="h-5 w-5" style={{ color: themeColors.sage }} />
                ) : (
                  <X className="h-5 w-5 text-destructive" />
                )}
              </div>
            )}
            
            {/* Eye Icon */}
            <button
              type="button"
              className={`absolute ${formData.confirmPassword && formData.password ? 'top-1/3 -translate-y-1/3' : 'top-1/2 -translate-y-1/2'} right-2 grid place-items-center w-8 h-8 hover:opacity-70 transition-opacity z-20`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <EyeIcon className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            {/* Error Message */}
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-destructive flex items-center space-x-2">
                <X className="h-3 w-3 flex-shrink-0" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
            
            {/* Success Message */}
            {formData.confirmPassword && formData.password && formData.confirmPassword === formData.password && !errors.confirmPassword && (
              <p className="mt-1 text-sm flex items-center space-x-2" style={{ color: themeColors.sage }}>
                <Check className="h-3 w-3 flex-shrink-0" />
                <span>Passwords match</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "flex w-full justify-center items-center rounded-full px-4 py-4 text-lg font-bold shadow-lg",
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
                <Loader2 className="animate-spin mr-2" size={20} />
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
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
  );
}
