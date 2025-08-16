'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Camera, Users, User, Leaf } from 'lucide-react';
import { usePlantColors } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/dashboard',
  },
  {
    id: 'plants',
    label: 'Plants',
    icon: Leaf,
    href: '/plants',
  },
  {
    id: 'capture',
    label: 'Capture',
    icon: Camera,
    href: '/capture',
  },
  {
    id: 'community',
    label: 'Community',
    icon: Users,
    href: '/community',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    href: '/profile',
  },
];

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const colors = usePlantColors();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <footer className="sticky bottom-0 bg-background/90 backdrop-blur-sm border-t border-border mt-auto z-50">
      <nav className="flex justify-around items-center h-16 sm:h-20 max-w-4xl mx-auto px-2 sm:px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/plants' && pathname?.startsWith('/plants'));

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-colors min-w-0 flex-1 py-2",
                isActive 
                  ? "text-sage" 
                  : "text-muted-foreground hover:text-sage"
              )}
              style={{
                color: isActive ? colors.sage : undefined
              }}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 sm:h-7 sm:w-7 flex-shrink-0",
                  isActive ? "fill-current" : ""
                )}
              />
              <p className="text-xs font-bold truncate">{item.label}</p>
            </button>
          );
        })}
      </nav>
    </footer>
  );
}
