'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useThemeColors } from '@/lib/theme/hooks';
import { cn } from '@/lib/utils';
import { LogOut, User, Settings, Leaf, TrendingUp, Bell } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const themeColors = useThemeColors();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) {
    return null; // or loading spinner
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Leaf className="h-8 w-8" style={{ color: themeColors.sage }} />
              <h1 className="text-2xl font-bold text-foreground">Plantopia</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-foreground">
                <User className="h-5 w-5" />
                <span>Welcome, {user.username}!</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name || user.username}! 🌱
          </h2>
          <p className="text-muted-foreground">
            Ready to continue your plant journey? Here's what's happening with your green friends.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center space-x-3">
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${themeColors.sage}20` }}
              >
                <Leaf className="h-6 w-6" style={{ color: themeColors.sage }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Plants in Collection</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center space-x-3">
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${themeColors.sage}20` }}
              >
                <TrendingUp className="h-6 w-6" style={{ color: themeColors.sage }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">89%</p>
                <p className="text-sm text-muted-foreground">Healthy Plants</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center space-x-3">
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${themeColors.sage}20` }}
              >
                <Bell className="h-6 w-6" style={{ color: themeColors.sage }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Care Reminders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm text-center">
          <div 
            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${themeColors.sage}20` }}
          >
            <Settings className="h-10 w-10" style={{ color: themeColors.sage }} />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Dashboard Coming Soon!</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We're working hard to bring you the best plant care experience. 
            Your personalized dashboard with plant management, care schedules, and AI recommendations will be available soon.
          </p>
          <button
            onClick={() => router.push('/')}
            className={cn(
              "px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105",
              "text-white shadow-lg"
            )}
            style={{ backgroundColor: themeColors.sage }}
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
