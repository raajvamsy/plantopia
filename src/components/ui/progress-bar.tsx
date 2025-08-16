'use client';

import React from 'react';
import { usePlantColors } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export default function ProgressBar({
  value,
  className,
  showLabel = true,
  label = 'Progress',
}: ProgressBarProps) {
  const colors = usePlantColors();
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("flex items-center gap-3 sm:gap-4", className)}>
      {showLabel && (
        <p className="text-foreground font-semibold text-sm sm:text-base flex-shrink-0">{label}</p>
      )}
      <div 
        className="flex-1 h-2.5 sm:h-3 rounded-full overflow-hidden"
        style={{ backgroundColor: `${colors.sage}20` }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clampedValue}%`,
            backgroundColor: colors.sage,
          }}
        />
      </div>
      <p 
        className="font-bold text-base sm:text-lg flex-shrink-0"
        style={{ color: colors.sage }}
      >
        {clampedValue}%
      </p>
    </div>
  );
}
