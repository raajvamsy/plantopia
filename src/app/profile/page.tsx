'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { User, ArrowLeft, Settings, LogOut, Edit } from 'lucide-react';
import { usePlantColors } from '@/lib/theme';
import BottomNavigation from '@/components/ui/bottom-navigation';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const colors = usePlantColors();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  const userName = user.name || user.username || 'Plant Lover';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <h1 className="text-foreground text-xl font-bold">Profile</h1>
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <div 
                  className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.sage} 0%, ${colors.mint} 100%)`
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">{userName}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Plant enthusiast since {new Date().getFullYear()}
                </p>
              </div>
              <button className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                <Edit className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-xl p-4 border border-border text-center">
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Plants</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border text-center">
              <p className="text-2xl font-bold text-foreground">45</p>
              <p className="text-sm text-muted-foreground">Care Days</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border text-center">
              <p className="text-2xl font-bold text-foreground">89%</p>
              <p className="text-sm text-muted-foreground">Health Avg</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            <button className="w-full flex items-center gap-4 bg-card p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
              <Settings className="h-6 w-6" style={{ color: colors.sage }} />
              <span className="text-foreground font-medium">Settings</span>
            </button>
            
            <button className="w-full flex items-center gap-4 bg-card p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
              <User className="h-6 w-6" style={{ color: colors.sage }} />
              <span className="text-foreground font-medium">Edit Profile</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 bg-card p-4 rounded-xl border border-border hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-6 w-6 text-destructive" />
              <span className="text-destructive font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
