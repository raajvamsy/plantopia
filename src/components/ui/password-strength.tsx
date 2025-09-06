'use client';

import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import { useThemeColors, usePlantColors } from '@/lib/theme/hooks';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface StrengthResult {
  score: number;
  label: string;
  color: string;
}

const calculatePasswordStrength = (password: string, themeColors: Record<string, string>): StrengthResult => {
  if (!password) {
    return { score: 0, label: '', color: themeColors.border };
  }

  let score = 0;

  // Length-based scoring (progressive)
  if (password.length >= 8) {
    score += 25;
  } else if (password.length >= 6) {
    score += 5; // Below minimum, very low score
  }

  // Character type diversity
  if (/[a-z]/.test(password)) {
    score += 15; // Lowercase letters
  }

  if (/[A-Z]/.test(password)) {
    score += 15; // Uppercase letters
  }

  if (/\d/.test(password)) {
    score += 15; // Numbers
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 20; // Special characters
  }

  // Bonus scoring for complexity
  let bonusScore = 0;

  // Length bonuses
  if (password.length >= 16) {
    bonusScore += 10; // Very long password
  } else if (password.length >= 14) {
    bonusScore += 5; // Long password
  }

  // Diversity bonus - multiple character types
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const typeCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (typeCount === 4) {
    bonusScore += 15; // All character types present
  } else if (typeCount === 3) {
    bonusScore += 10; // Three character types
  }

  // Pattern complexity bonus
  if (!/(.)\1{4,}/.test(password)) { // Less strict - allows some repetition
    bonusScore += 5;
  }

  // Add bonus points
  score += bonusScore;

  // Ensure we can reach 100 for truly strong passwords
  score = Math.min(100, score);

  // Determine label and color using theme
  let label = '';
  let color = themeColors.border;

  if (score >= 80) {
    label = 'Strong';
    color = themeColors.sage; // Use theme sage color for strong
  } else if (score >= 60) {
    label = 'Good';
    color = themeColors.leaf; // Use theme leaf color for good
  } else if (score >= 40) {
    label = 'Fair';
    color = themeColors.earth; // Use theme earth color for fair
  } else if (score >= 20) {
    label = 'Weak';
    color = themeColors.destructive; // Use theme destructive for weak
  } else if (score > 0) {
    label = 'Very Weak';
    color = themeColors.destructive; // Use theme destructive for very weak
  }

  return { score, label, color };
};

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ 
  password, 
  className 
}) => {
  const themeColors = useThemeColors();
  const plantColors = usePlantColors();
  
  // Merge theme colors for easier access in calculation
  const allColors = { ...themeColors, ...plantColors };
  
  const { score, label, color } = calculatePasswordStrength(password, allColors);

  if (!password) return null;

  return (
    <div className={cn("px-1 pt-2 pb-1", className)}>
      <div className="flex items-center justify-between mb-1">
        <label 
          htmlFor="password-strength" 
          className="text-xs font-medium"
          style={{ color: themeColors.mutedForeground }}
        >
          Password strength
        </label>
        {label && (
          <span 
            className="text-xs font-medium"
            style={{ color }}
          >
            {label}
          </span>
        )}
      </div>
      
      <Progress.Root
        className="relative overflow-hidden rounded-full w-full h-1.5"
        style={{
          backgroundColor: `${themeColors.muted}50`, // Use theme muted color with transparency
          transform: 'translateZ(0)',
        }}
        value={score}
        max={100}
      >
        <Progress.Indicator
          className="h-full w-full rounded-full transition-transform duration-300 ease-out"
          style={{
            backgroundColor: color,
            transform: `translateX(-${100 - score}%)`,
          }}
        />
      </Progress.Root>
      
      {/* Optional: Show requirements */}
      {password && score < 80 && (
        <div className="mt-2 space-y-1">
          <p 
            className="text-xs font-medium"
            style={{ color: themeColors.mutedForeground }}
          >
            To make your password stronger:
          </p>
          <ul className="text-xs space-y-0.5 ml-2" style={{ color: themeColors.mutedForeground }}>
            {password.length < 8 && (
              <li className="flex items-center space-x-1">
                <span style={{ color: themeColors.destructive }}>•</span>
                <span>Use at least 8 characters</span>
              </li>
            )}
            {!/[a-z]/.test(password) && (
              <li className="flex items-center space-x-1">
                <span style={{ color: themeColors.destructive }}>•</span>
                <span>Include lowercase letters</span>
              </li>
            )}
            {!/[A-Z]/.test(password) && (
              <li className="flex items-center space-x-1">
                <span style={{ color: themeColors.destructive }}>•</span>
                <span>Include uppercase letters</span>
              </li>
            )}
            {!/\d/.test(password) && (
              <li className="flex items-center space-x-1">
                <span style={{ color: themeColors.destructive }}>•</span>
                <span>Include numbers</span>
              </li>
            )}
            {!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) && (
              <li className="flex items-center space-x-1">
                <span style={{ color: themeColors.destructive }}>•</span>
                <span>Include special characters</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;
