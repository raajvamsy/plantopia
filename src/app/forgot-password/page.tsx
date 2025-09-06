'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { useThemeColors } from '@/lib/theme/hooks';
import { cn } from '@/lib/utils';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useSupabaseAuth();
  const themeColors = useThemeColors();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || 'Failed to send reset email');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    if (error) {
      setError('');
    }
  };

  if (isSuccess) {
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
        
        <div className="relative z-10 w-full max-w-md space-y-6 rounded-3xl bg-card/90 p-8 shadow-2xl backdrop-blur-md border border-border text-center">
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${themeColors.sage}20` }}
          >
            <CheckCircle className="h-8 w-8" style={{ color: themeColors.sage }} />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Check Your Email</h1>
            <p className="text-muted-foreground">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Didn&apos;t receive the email? Check your spam folder or</p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail('');
              }}
              className="font-medium hover:underline"
              style={{ color: themeColors.sage }}
            >
              try again
            </button>
          </div>
          
          <Link
            href="/login"
            className={cn(
              "flex w-full justify-center items-center rounded-full px-4 py-3 text-base font-bold shadow-lg",
              "transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2",
              "text-white"
            )}
            style={{ 
              backgroundColor: themeColors.sage,
            }}
          >
            Back to Login
          </Link>
        </div>
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
          <h1 className="text-4xl font-bold text-foreground">Forgot Password?</h1>
          <p className="mt-2 text-muted-foreground">
            No worries! Enter your email and we&apos;ll send you reset instructions.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive text-center border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => handleInputChange(e.target.value)}
              className={cn(
                "block w-full rounded-full border-2 px-5 py-4 text-lg transition duration-300",
                "bg-muted/50 text-foreground placeholder-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                error 
                  ? "border-destructive focus:border-destructive focus:ring-destructive" 
                  : "border-transparent focus:border-primary focus:ring-primary",
              )}
              placeholder="Enter your email"
            />
            {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
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
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
