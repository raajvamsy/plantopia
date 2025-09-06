'use client';

import React, { forwardRef } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({
    label,
    error,
    showPasswordToggle = false,
    isPassword = false,
    showPassword = false,
    onTogglePassword,
    containerClassName,
    labelClassName,
    inputClassName,
    errorClassName,
    className,
    type,
    ...props
  }, ref) => {
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={cn('space-y-1', containerClassName)}>
        {label && (
          <label 
            htmlFor={props.id}
            className={cn(
              'block text-sm font-medium text-foreground',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'block w-full rounded-full border-2 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg transition duration-300',
              'bg-muted/50 text-foreground placeholder-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              error 
                ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                : 'border-transparent focus:border-primary focus:ring-primary',
              showPasswordToggle && 'pr-12 sm:pr-14',
              inputClassName,
              className
            )}
            {...props}
          />
          
          {showPasswordToggle && (
            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-3 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 hover:opacity-70 transition-opacity z-20"
              onClick={onTogglePassword}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 sm:h-5 sm:w-5 text-muted-foreground" />
              ) : (
                <EyeIcon className="h-5 w-5 sm:h-5 sm:w-5 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
        
        {error && (
          <p className={cn('text-xs sm:text-sm text-destructive', errorClassName)}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export { FormInput };
export default FormInput;
