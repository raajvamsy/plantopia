'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface MobilePageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  hasHeader?: boolean;
  hasBottomNav?: boolean;
  paddingTop?: 'none' | 'sm' | 'md' | 'lg';
  paddingBottom?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingTopClasses = {
  none: '',
  sm: 'pt-2',
  md: 'pt-4',
  lg: 'pt-8',
};

const paddingBottomClasses = {
  none: '',
  sm: 'pb-2',
  md: 'pb-4', 
  lg: 'pb-8',
};

const MobilePageWrapper = React.forwardRef<HTMLDivElement, MobilePageWrapperProps>(
  ({ 
    className, 
    hasHeader = true,
    hasBottomNav = true,
    paddingTop = 'md',
    paddingBottom = 'none',
    children, 
    ...props 
  }, ref) => {
      return (
    <div
      ref={ref}
      className={cn(
        'min-h-screen bg-background flex flex-col',
        className
      )}
      {...props}
    >
      <main 
        className={cn(
          'flex-1 relative',
          paddingTopClasses[paddingTop],
          hasBottomNav ? 'sm:pb-20' : paddingBottomClasses[paddingBottom]
        )}
      >
        {children}
      </main>
    </div>
    );
  }
);

MobilePageWrapper.displayName = 'MobilePageWrapper';

export { MobilePageWrapper };
