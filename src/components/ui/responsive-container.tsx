'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full',
};

const paddingClasses = {
  none: '',
  sm: 'px-3 sm:px-4',
  md: 'px-4 sm:px-6',
  lg: 'px-4 sm:px-6 lg:px-8',
  xl: 'px-6 sm:px-8 lg:px-12',
};

const ResponsiveContainer = React.forwardRef<HTMLDivElement, ResponsiveContainerProps>(
  ({ 
    className, 
    maxWidth = '4xl', 
    padding = 'lg', 
    center = true, 
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
          center && 'mx-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveContainer.displayName = 'ResponsiveContainer';

export { ResponsiveContainer };
