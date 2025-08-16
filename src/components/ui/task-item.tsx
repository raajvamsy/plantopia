'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { usePlantColors } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  completed?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function TaskItem({
  icon: Icon,
  title,
  description,
  completed = false,
  onClick,
  className,
}: TaskItemProps) {
  const colors = usePlantColors();

  return (
    <div
      className={cn(
        "flex items-center gap-3 sm:gap-4 bg-card p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-border cursor-pointer",
        completed && "opacity-75",
        className
      )}
      onClick={onClick}
    >
      <div
        className="flex items-center justify-center rounded-full shrink-0 size-10 sm:size-12 transition-colors"
        style={{
          backgroundColor: `${colors.sage}20`,
          color: colors.sage,
        }}
      >
        <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-semibold text-foreground text-sm sm:text-base",
          completed && "line-through"
        )}>
          {title}
        </p>
        <p className="text-muted-foreground text-xs sm:text-sm leading-tight mt-0.5">
          {description}
        </p>
      </div>
      {completed && (
        <div
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: colors.sage }}
        >
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
