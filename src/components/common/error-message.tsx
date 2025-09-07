'use client';

import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  iconClassName?: string;
  messageClassName?: string;
}

const typeClasses = {
  error: 'bg-destructive/10 text-destructive border-destructive/20',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

const iconClasses = {
  error: 'text-destructive',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
};

export function ErrorMessage({
  message,
  type = 'error',
  dismissible = false,
  onDismiss,
  className,
  iconClassName,
  messageClassName,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-4 text-sm border flex items-start gap-3 animate-in slide-in-from-top-2 duration-300',
        'shadow-sm',
        typeClasses[type],
        className
      )}
    >
      <AlertCircle 
        className={cn(
          'h-5 w-5 flex-shrink-0 mt-0.5',
          iconClasses[type],
          iconClassName
        )}
      />
      <span className={cn('flex-1 font-medium leading-relaxed', messageClassName)}>
        {message}
      </span>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 hover:opacity-70 transition-all duration-200',
            'p-1 rounded-full hover:bg-black/5',
            iconClasses[type]
          )}
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
