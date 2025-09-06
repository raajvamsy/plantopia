'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { usePlantColors } from '@/lib/theme';
import { 
  Menu,
  X,
  Home,
  Camera,
  Users,
  User,
  Leaf,
  Settings,
  LogOut,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  section?: 'main' | 'actions';
}

const navItems: NavItem[] = [
  // Main navigation items
  {
    id: 'home',
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    section: 'main'
  },
  {
    id: 'plants',
    label: 'My Plants',
    icon: Leaf,
    href: '/plants',
    section: 'main'
  },
  {
    id: 'capture',
    label: 'Plant Scanner',
    icon: Camera,
    href: '/capture',
    section: 'main'
  },
  {
    id: 'community',
    label: 'Community',
    icon: Users,
    href: '/community',
    section: 'main'
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageCircle,
    href: '/messages',
    section: 'main'
  },
  // Action items
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    href: '/profile',
    section: 'actions'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    section: 'actions'
  }
];



export function LeftNavigationTrigger({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <button
        onClick={handleOpen}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          className
        )}
        aria-label="Open navigation menu"
        type="button"
      >
        <Menu className="h-5 w-5" />
      </button>
      
      <LeftNavigation isOpen={isOpen} onClose={handleClose} />
    </>
  );
}

interface LeftNavigationNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeftNavigation({ isOpen, onClose }: LeftNavigationNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useSupabaseAuth();
  const colors = usePlantColors();
  const [mounted, setMounted] = useState(false);



  // Ensure we're mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on route change (but not on initial mount)
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]); // Removed onClose from dependencies

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userName = user?.full_name || user?.username || 'Plant Lover';

  if (!mounted) return null;

  const navigationContent = (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{ 
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 300ms ease-out'
          }}
        />
      )}
      
      {/* Navigation Menu */}
      <nav 
        className="fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-background backdrop-blur-md shadow-2xl border-r border-border transition-transform duration-300 ease-out"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8 text-primary flex-shrink-0" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd" />
              <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd" />
            </svg>
            <h2 className="text-xl font-bold tracking-tight">Plantopia</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div 
              className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg ring-2 ring-white/10"
              style={{ 
                background: `linear-gradient(135deg, ${colors.sage} 0%, ${colors.mint} 50%, ${colors.sage} 100%)`,
                boxShadow: `0 4px 12px ${colors.sage}25, inset 0 1px 0 rgba(255, 255, 255, 0.15)`
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-2">
          {/* Main Navigation */}
          <div className="mb-6">
            <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navigation
            </h3>
            <div className="space-y-1">
              {navItems.filter(item => item.section === 'main').map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href === '/plants' && pathname?.startsWith('/plants')) ||
                  (item.href === '/messages' && pathname?.startsWith('/messages'));

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    style={{
                      backgroundColor: isActive ? `${colors.sage}15` : undefined,
                      color: isActive ? colors.sage : undefined
                    }}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Items */}
          <div className="mb-6">
            <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Account
            </h3>
            <div className="space-y-1">
              {navItems.filter(item => item.section === 'actions').map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    style={{
                      backgroundColor: isActive ? `${colors.sage}15` : undefined,
                      color: isActive ? colors.sage : undefined
                    }}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer / Logout */}
        <div className="border-t border-border p-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">Sign Out</span>
          </button>
        </div>
      </nav>
    </>
  );

  return createPortal(navigationContent, document.body);
}

export default LeftNavigation;
