'use client';

import React from 'react';
import { LeafSpinner } from '@/components/ui';
import { usePlantColors } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const sizeClasses = {
  sm: 'px-3 py-2 text-sm min-h-[36px]',
  md: 'px-4 py-3 text-base min-h-[44px]',
  lg: 'px-6 py-4 text-lg min-h-[52px]',
};

const variantClasses = {
  default: 'text-white shadow-lg',
  outline: 'border-2 text-primary border-primary bg-transparent hover:bg-primary hover:text-white',
  ghost: 'text-primary bg-transparent hover:bg-primary/10',
};

export function PrimaryButton({
  isLoading = false,
  loadingText,
  icon,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: PrimaryButtonProps) {
  const colors = usePlantColors();

  const buttonStyle = variant === 'default' ? {
    backgroundColor: colors.sage,
  } : {};

  return (
    <button
      className={cn(
        'flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-300',
        'transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      style={buttonStyle}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LeafSpinner size="sm" />
          {loadingText || 'Loading...'}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}

export default PrimaryButton;
