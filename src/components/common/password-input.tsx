'use client';

import React, { forwardRef } from 'react';
import { EyeIcon, EyeOffIcon, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/lib/theme/hooks';
import { PasswordStrength } from '@/components/ui/password-strength';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  
  // Password matching props
  matchPassword?: string;
  showMatchIndicator?: boolean;
  
  // Password strength props
  showStrength?: boolean;
  
  // Success message for matching
  successMessage?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({
    label,
    error,
    showPassword = false,
    onTogglePassword,
    containerClassName,
    labelClassName,
    inputClassName,
    errorClassName,
    className,
    matchPassword,
    showMatchIndicator = false,
    showStrength = false,
    successMessage,
    value,
    ...props
  }, ref) => {
    const themeColors = useThemeColors();
    
    // Check if passwords match
    const passwordsMatch = showMatchIndicator && 
      value && 
      matchPassword && 
      value === matchPassword;
    
    const hasMatchingContent = showMatchIndicator && value && matchPassword;
    
    // Determine if we should show success styling
    const showSuccessState = passwordsMatch && !error;

    return (
      <div className={cn('space-y-0', containerClassName)}>
        {label && (
          <label 
            htmlFor={props.id}
            className={cn(
              'block text-sm font-medium text-foreground mb-1',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'block w-full rounded-full border-2 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg transition duration-300 relative z-10',
              'bg-muted/50 text-foreground placeholder-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              // Dynamic border styling
              error 
                ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                : showSuccessState
                ? ''
                : 'border-transparent focus:border-primary focus:ring-primary',
              // Dynamic padding for icons
              hasMatchingContent ? 'pr-16 sm:pr-20 md:pr-24' : 'pr-10 sm:pr-12',
              inputClassName,
              className
            )}
            style={{
              ...(showSuccessState ? {
                borderColor: themeColors.sage,
                '--tw-ring-color': themeColors.sage,
              } : {})
            }}
            value={value}
            {...props}
          />
          
          {/* Eye Icon - Always rightmost */}
          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 right-2 grid place-items-center w-6 h-6 sm:w-8 sm:h-8 hover:opacity-70 transition-opacity z-20"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            ) : (
              <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            )}
          </button>
          
          {/* Password Match Indicator - Left of eye icon */}
          {hasMatchingContent && (
            <div className="absolute top-1/2 -translate-y-1/2 right-12 sm:right-14 md:right-16 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 z-20 pointer-events-none">
              {passwordsMatch ? (
                <Check className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: themeColors.sage }} />
              ) : (
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
              )}
            </div>
          )}
        </div>
        
        {/* Password Strength Indicator */}
        {showStrength && (
          <PasswordStrength password={value as string} />
        )}
        
        {/* Error Message */}
        {error && (
          <p className={cn('mt-1 text-xs sm:text-sm text-destructive flex items-center space-x-2', errorClassName)}>
            <X className="h-3 w-3 flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}
        
        {/* Success Message */}
        {passwordsMatch && !error && successMessage && (
          <p className="mt-1 text-xs sm:text-sm flex items-center space-x-2" style={{ color: themeColors.sage }}>
            <Check className="h-3 w-3 flex-shrink-0" />
            <span>{successMessage}</span>
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
export default PasswordInput;
