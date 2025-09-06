'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { usePlantopiaTheme } from '@/lib/theme';
import { ArrowLeft, ChevronRight, Calendar, HelpCircle, MessageSquare, FileText } from 'lucide-react';
import { BottomNavigation, PlantopiaHeader, MobilePageWrapper } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ checked, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div 
        className={cn(
          "w-11 h-6 rounded-full peer transition-colors",
          "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all",
          checked 
            ? "bg-primary after:translate-x-full" 
            : "bg-border",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />
    </label>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useSupabaseAuth();
  const { theme, setTheme, isDark } = usePlantopiaTheme();
  
  // Settings state
  const [settings, setSettings] = useState({
    darkMode: isDark,
    wateringReminders: false,
    growthUpdates: true,
    language: 'English'
  });

  // Update dark mode state when theme changes
  React.useEffect(() => {
    setSettings(prev => ({ ...prev, darkMode: isDark }));
  }, [isDark]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Handle dark mode toggle
    if (key === 'darkMode') {
      setTheme(value ? 'dark' : 'light');
    }
  };

  // Redirect if not authenticated (client-side only)
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const userName = user?.full_name || user?.username || 'Flora Greenleaf';

  return (
    <MobilePageWrapper>
      <PlantopiaHeader currentPage="settings" />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-8">
          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter">Settings</h1>
            <p className="mt-2 text-lg text-muted-foreground">Manage your app and account preferences.</p>
          </header>

          {/* Settings Sections */}
          <div className="space-y-10">
            {/* General Section */}
            <section>
              <h2 className="text-xl font-bold mb-4 px-4">General</h2>
              <div className="divide-y divide-border rounded-2xl bg-card overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex-1 pr-4">
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Better for your eyes at night.</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.darkMode}
                    onChange={(checked) => handleToggle('darkMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex-1 pr-4">
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">Choose your preferred language.</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{settings.language}</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </section>

            {/* Notifications Section */}
            <section>
              <h2 className="text-xl font-bold mb-4 px-4">Notifications</h2>
              <div className="divide-y divide-border rounded-2xl bg-card overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex-1 pr-4">
                    <p className="font-medium">Watering Reminders</p>
                    <p className="text-sm text-muted-foreground">Get reminders to water your plants.</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.wateringReminders}
                    onChange={(checked) => handleToggle('wateringReminders', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex-1 pr-4">
                    <p className="font-medium">Growth Updates</p>
                    <p className="text-sm text-muted-foreground">See your plant&apos;s progress.</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.growthUpdates}
                    onChange={(checked) => handleToggle('growthUpdates', checked)}
                  />
                </div>
              </div>
            </section>

            {/* Support Section */}
            <section>
              <h2 className="text-xl font-bold mb-4 px-4">Support</h2>
              <div className="divide-y divide-border rounded-2xl bg-card overflow-hidden">
                <button 
                  onClick={() => router.push('/help')}
                  className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Help & FAQs</p>
                      <p className="text-sm text-muted-foreground">Get answers and troubleshooting tips</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
                <button 
                  onClick={() => router.push('/feedback')}
                  className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Send Feedback</p>
                      <p className="text-sm text-muted-foreground">Share your thoughts and suggestions</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
                <button 
                  onClick={() => router.push('/terms')}
                  className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Terms &amp; Privacy</p>
                      <p className="text-sm text-muted-foreground">View our terms of service and privacy policy</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </section>

            {/* Account Section */}
            <section>
              <h2 className="text-xl font-bold mb-4 px-4">Account</h2>
              <div className="divide-y divide-border rounded-2xl bg-card overflow-hidden">
                <button 
                  onClick={() => router.push('/change-password')}
                  className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors text-left"
                >
                  <p className="font-medium">Change Password</p>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors text-left"
                >
                  <p className="font-medium text-destructive">Logout</p>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </section>
          </div>
      </div>
      <BottomNavigation />
    </MobilePageWrapper>
  );
}
