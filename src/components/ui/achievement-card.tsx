'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { usePlantColors } from '@/lib/theme';

interface AchievementCardProps {
  title: string;
  icon?: React.ReactNode;
  completed?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function AchievementCard({
  title,
  icon,
  completed = false,
  onClick,
  className,
}: AchievementCardProps) {
  const colors = usePlantColors();

  const defaultIcon = (
    <svg 
      className="text-current" 
      fill="currentColor" 
      height="24" 
      viewBox="0 0 256 256" 
      width="24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M229.66,77.66l-48-48A8,8,0,0,0,176,32H80a8,8,0,0,0-5.66,2.34l-48,48A8,8,0,0,0,24,88v96a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V88A8,8,0,0,0,229.66,77.66ZM128,160a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-72v88a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V88H88.54a48,48,0,1,0,78.92,0H216Z"></path>
    </svg>
  );

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md cursor-pointer",
        completed && "bg-accent/10 border-accent",
        className
      )}
      onClick={onClick}
    >
      <div 
        className={cn(
          "flex-shrink-0 size-10 rounded-full flex items-center justify-center",
          completed ? "text-accent" : "text-primary"
        )}
        style={{ 
          backgroundColor: completed ? colors.mint + '30' : colors.sage + '20'
        }}
      >
        {icon || defaultIcon}
      </div>
      <h3 className="text-base font-semibold text-foreground flex-1">
        {title}
      </h3>
      {completed && (
        <div className="flex-shrink-0 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
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
