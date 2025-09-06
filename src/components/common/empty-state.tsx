'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon | React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionClassName?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
  actionClassName,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-8 px-4', className)}>
      {Icon && (
        <div className={cn('mb-4', iconClassName)}>
          {typeof Icon === 'function' ? (
            <Icon className="h-12 w-12 text-muted-foreground" />
          ) : (
            Icon
          )}
        </div>
      )}
      
      <h3 className={cn('text-lg font-semibold text-foreground mb-2', titleClassName)}>
        {title}
      </h3>
      
      {description && (
        <p className={cn('text-sm text-muted-foreground mb-4 max-w-sm', descriptionClassName)}>
          {description}
        </p>
      )}
      
      {action && (
        <div className={cn('mt-2', actionClassName)}>
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
