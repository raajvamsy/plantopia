'use client';

import * as React from 'react';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileCheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

const MobileCheckbox = React.forwardRef<HTMLButtonElement, MobileCheckboxProps>(
  ({ id, checked = false, onCheckedChange, disabled = false, className, 'aria-label': ariaLabel, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        handleClick();
      }
    };

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={{
          // Force these styles with inline CSS to override any conflicts  
          width: '28px',
          height: '28px',
          minWidth: '28px', 
          minHeight: '28px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          border: `2px solid ${checked ? '#84cc16' : '#d1d5db'}`,
          backgroundColor: checked ? '#84cc16' : '#ffffff',
          color: checked ? 'white' : 'transparent',
          transition: 'all 0.2s ease',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
        className={cn(
          'hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95',
          className
        )}
        {...props}
      >
        {/* Check icon with smooth transition */}
        <CheckIcon 
          style={{
            width: '18px',
            height: '18px',
            strokeWidth: '3',
            opacity: checked ? 1 : 0,
            transform: checked ? 'scale(1)' : 'scale(0.75)',
            transition: 'all 0.2s ease',
          }}
        />
      </button>
    );
  }
);

MobileCheckbox.displayName = 'MobileCheckbox';

export { MobileCheckbox };
