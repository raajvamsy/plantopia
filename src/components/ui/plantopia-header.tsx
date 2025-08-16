'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { usePlantColors } from '@/lib/theme';
import { 
  Settings, 
  User, 
  ArrowLeft,
  Calendar,
  Search,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

type PageType = 'dashboard' | 'plants' | 'plant' | 'capture' | 'settings' | 'profile' | 'community';

interface PlantopiaHeaderProps {
  currentPage: PageType;
  showBackButton?: boolean;
  customTitle?: string;
  className?: string;
}

const pageConfig = {
  dashboard: {
    title: 'Dashboard',
    rightIcons: ['settings', 'profile']
  },
  plants: {
    title: 'My Plants',
    rightIcons: ['settings', 'profile']
  },
  plant: {
    title: 'Plant Details',
    rightIcons: ['settings', 'profile']
  },
  capture: {
    title: 'Plant Scanner',
    rightIcons: ['settings', 'profile']
  },
  settings: {
    title: 'Settings',
    rightIcons: ['calendar', 'profile']
  },
  profile: {
    title: 'Profile',
    rightIcons: ['settings', 'calendar']
  },
  community: {
    title: 'Community',
    rightIcons: ['search', 'message', 'profile']
  }
};

const iconComponents = {
  settings: Settings,
  profile: User,
  calendar: Calendar,
  search: Search,
  message: MessageCircle,
};

export default function PlantopiaHeader({ 
  currentPage, 
  showBackButton = false, 
  customTitle,
  className 
}: PlantopiaHeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const colors = usePlantColors();

  const config = pageConfig[currentPage];
  const title = customTitle || config.title;
  const userName = user?.name || user?.username || 'Plant Lover';

  const handleNavigation = (destination: string) => {
    router.push(`/${destination}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <header className={cn(
      "sticky top-0 z-10 h-14 sm:h-16 flex items-center justify-between whitespace-nowrap border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6",
      className
    )}>
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <svg className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd" />
            <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd" />
          </svg>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">Plantopia</h1>
            {title !== 'Plantopia' && (
              <span className="text-xs sm:text-sm text-muted-foreground">{title}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {config.rightIcons.map((iconType) => {
          const IconComponent = iconComponents[iconType as keyof typeof iconComponents];
          return (
            <button
              key={iconType}
              onClick={() => {
                if (iconType === 'calendar') {
                  handleNavigation('dashboard');
                } else if (iconType === 'search') {
                  // Focus search input if available, or handle search action
                  const searchInput = document.getElementById('search');
                  if (searchInput) {
                    searchInput.focus();
                  }
                } else if (iconType === 'message') {
                  // Could navigate to messages page when implemented
                  console.log('Messages functionality to be implemented');
                } else {
                  handleNavigation(iconType);
                }
              }}
              className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          );
        })}
        
        {/* User Avatar */}
        <button
          onClick={() => handleNavigation('profile')}
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
        >
          <div 
            className="w-full h-full flex items-center justify-center text-white font-bold text-xs sm:text-sm"
            style={{ 
              background: `linear-gradient(135deg, ${colors.sage} 0%, ${colors.mint} 100%)`
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
        </button>
      </div>
    </header>
  );
}
