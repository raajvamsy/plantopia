'use client';

import React from 'react';
import { 
  MobilePageWrapper, 
  PlantopiaHeader, 
  ResponsiveContainer, 
  BottomNavigation 
} from '@/components/ui';

interface PageLayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'plants' | 'plant' | 'capture' | 'settings' | 'profile' | 'community' | 'messages';
  customTitle?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBottomNav?: boolean;
  showHeader?: boolean;
}

export function PageLayout({
  children,
  currentPage,
  customTitle,
  maxWidth = '4xl',
  padding = 'lg',
  className,
  showBottomNav = true,
  showHeader = true,
}: PageLayoutProps) {
  return (
    <MobilePageWrapper>
      {showHeader && (
        <PlantopiaHeader 
          currentPage={currentPage} 
          customTitle={customTitle}
        />
      )}
      <ResponsiveContainer 
        maxWidth={maxWidth} 
        padding={padding} 
        className={className}
      >
        {children}
      </ResponsiveContainer>
      {showBottomNav && <BottomNavigation />}
    </MobilePageWrapper>
  );
}

export default PageLayout;
