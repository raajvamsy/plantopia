'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { usePlantColors } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  subMessage?: string;
  className?: string;
  messageClassName?: string;
  subMessageClassName?: string;
  showMessage?: boolean;
  color?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

export function LoadingSpinner({
  size = 'md',
  message,
  subMessage,
  className,
  messageClassName,
  subMessageClassName,
  showMessage = false,
  color,
}: LoadingSpinnerProps) {
  const colors = usePlantColors();
  const spinnerColor = color || colors.sage;

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 
        className={cn(
          'animate-spin',
          sizeClasses[size]
        )}
        style={{ color: spinnerColor }}
      />
      {showMessage && message && (
        <p className={cn('text-sm font-medium text-foreground', messageClassName)}>
          {message}
        </p>
      )}
      {subMessage && (
        <p className={cn('text-xs text-muted-foreground', subMessageClassName)}>
          {subMessage}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;
