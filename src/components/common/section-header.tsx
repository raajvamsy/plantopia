'use client';

import React from 'react';
import { usePlantColors } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  actionClassName?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
  titleClassName,
  subtitleClassName,
  actionClassName,
}: SectionHeaderProps) {
  const colors = usePlantColors();

  return (
    <div className={cn('flex items-center justify-between mb-4 sm:mb-6', className)}>
      <div className="flex-1">
        <h2 className={cn('text-xl sm:text-2xl font-bold text-foreground', titleClassName)}>
          {title}
        </h2>
        {subtitle && (
          <p className={cn('text-sm sm:text-base text-muted-foreground mt-1', subtitleClassName)}>
            {subtitle}
          </p>
        )}
      </div>
      
      {action && (
        <div 
          className={cn('flex-shrink-0', actionClassName)}
          style={{ color: colors.sage }}
        >
          {action}
        </div>
      )}
    </div>
  );
}

export default SectionHeader;
