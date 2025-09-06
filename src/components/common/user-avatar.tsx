'use client';

import React from 'react';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { usePlantColors } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  onClick?: () => void;
  className?: string;
  nameClassName?: string;
  customName?: string;
  customInitial?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
  xl: 'h-12 w-12 text-lg',
};

const nameSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

export function UserAvatar({
  size = 'md',
  showName = false,
  onClick,
  className,
  nameClassName,
  customName,
  customInitial,
}: UserAvatarProps) {
  const { user } = useSupabaseAuth();
  const colors = usePlantColors();
  
  const userName = customName || user?.full_name || user?.username || 'Plant Lover';
  const userInitial = customInitial || userName.charAt(0).toUpperCase();

  const avatarElement = (
    <div
      className={cn(
        'rounded-full flex items-center justify-center text-white font-semibold shadow-md transition-all duration-200',
        'hover:scale-105 hover:shadow-lg',
        sizeClasses[size],
        onClick && 'cursor-pointer',
        className
      )}
      style={{ 
        background: `linear-gradient(135deg, ${colors.sage} 0%, ${colors.mint} 50%, ${colors.sage} 100%)`,
        boxShadow: `0 2px 8px ${colors.sage}20, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
      }}
      onClick={onClick}
    >
      {userInitial}
    </div>
  );

  if (showName) {
    return (
      <div className="flex items-center gap-3">
        {avatarElement}
        <span className={cn('font-medium text-foreground', nameSizeClasses[size], nameClassName)}>
          {userName}
        </span>
      </div>
    );
  }

  return avatarElement;
}

export default UserAvatar;
