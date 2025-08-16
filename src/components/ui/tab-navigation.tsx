'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { usePlantColors } from '@/lib/theme';

interface Tab {
  id: string;
  label: string;
  isActive?: boolean;
}

interface TabNavigationProps {
  tabs: Tab[];
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export default function TabNavigation({
  tabs,
  onTabChange,
  className,
}: TabNavigationProps) {
  const colors = usePlantColors();

  return (
    <div className={cn("border-b border-border", className)}>
      <nav aria-label="Tabs" className="flex -mb-px gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={cn(
              "shrink-0 border-b-2 px-1 pb-4 text-sm font-medium transition-colors",
              tab.isActive
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
            )}
            style={{
              borderBottomColor: tab.isActive ? colors.sage : 'transparent',
              color: tab.isActive ? colors.sage : undefined,
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
