'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Settings, Edit, Camera, X, Check } from 'lucide-react';
import { usePlantColors } from '@/lib/theme';
import BottomNavigation from '@/components/ui/bottom-navigation';
import PlantCard from '@/components/ui/plant-card';
import { cn } from '@/lib/utils';

// Mock data for achievements
const mockAchievements = [
  {
    id: 'green-thumb',
    title: 'Green Thumb',
    description: 'Successfully grew your first plant',
    icon: '🌱',
    completed: true,
    color: '#87A96B',
  },
  {
    id: 'hydration-hero',
    title: 'Hydration Hero',
    description: 'Watered plants for 30 consecutive days',
    icon: '💧',
    completed: true,
    color: '#7DB8E8',
  },
  {
    id: 'sun-worshipper',
    title: 'Sun Worshipper',
    description: 'Optimized sunlight for 10 plants',
    icon: '☀️',
    completed: true,
    color: '#FFD700',
  },
  {
    id: 'pest-pro',
    title: 'Pest Pro',
    description: 'Successfully treated pest issues',
    icon: '🛡️',
    completed: true,
    color: '#9CB86F',
  },
  {
    id: 'growth-spurt',
    title: 'Growth Spurt',
    description: 'Achieved rapid plant growth',
    icon: '📈',
    completed: false,
    color: '#B8E6B8',
  },
  {
    id: 'collector',
    title: 'Collector',
    description: 'Collect 50+ different plant species',
    icon: '🏆',
    completed: true,
    color: '#FFB84D',
  },
];

// Mock data for plants
const mockPlants = [
  {
    id: '1',
    name: 'Monstera',
    level: 5,
    health: 95,
    moisture: 78,
    sunlight: 82,
    imageUrl: 'https://images.unsplash.com/photo-1586763755131-e1b3bb9c8a8c?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Fiddle Leaf Fig',
    level: 3,
    health: 88,
    moisture: 65,
    sunlight: 90,
    imageUrl: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Snake Plant',
    level: 7,
    health: 92,
    moisture: 45,
    sunlight: 70,
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0a9ba536cee?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    name: 'ZZ Plant',
    level: 2,
    health: 85,
    moisture: 55,
    sunlight: 75,
    imageUrl: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=400&h=300&fit=crop',
  },
];

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  color: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const colors = usePlantColors();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [hoveredAchievement, setHoveredAchievement] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  const userName = user.name || user.username || 'Flora Greenleaf';
  const userBio = 'Plant enthusiast and nature lover';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-3">
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd" />
            <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd" />
          </svg>
          <h1 className="text-xl font-bold tracking-tight">Plantopia</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <div 
              className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
              style={{ 
                background: `linear-gradient(135deg, ${colors.sage} 0%, ${colors.mint} 100%)`
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          {/* Profile Section */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-primary">
                <div 
                  className="w-full h-full flex items-center justify-center text-white font-bold text-4xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.sage} 0%, ${colors.mint} 100%)`
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold">{userName}</h2>
              <p className="mt-1 text-lg text-muted-foreground">{userBio}</p>
            </div>
            <button 
              onClick={() => setEditModalOpen(true)}
              className="flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-transform hover:scale-105"
            >
              Edit Profile
            </button>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-card p-4">
            <div className="text-center">
              <p className="text-3xl font-bold">120</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">85</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
          </div>

          {/* Achievements */}
          <div className="mt-10">
            <h3 className="text-2xl font-bold">Achievements</h3>
            <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {mockAchievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="group relative flex flex-col items-center gap-2 text-center"
                  onMouseEnter={() => setHoveredAchievement(achievement.id)}
                  onMouseLeave={() => setHoveredAchievement(null)}
                >
                  <div 
                    className={cn(
                      "h-20 w-20 rounded-full flex items-center justify-center text-2xl transition-transform group-hover:scale-110",
                      achievement.completed ? "opacity-100" : "opacity-50 grayscale"
                    )}
                    style={{ backgroundColor: achievement.color + '20' }}
                  >
                    {achievement.icon}
                  </div>
                  {hoveredAchievement === achievement.id && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="rounded-md bg-secondary px-2 py-1 text-xs whitespace-nowrap">
                        {achievement.title}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Plant Showcase */}
          <div className="mt-10">
            <h3 className="text-2xl font-bold">Plant Showcase</h3>
            <div className="mt-4 flex snap-x snap-mandatory space-x-4 overflow-x-auto pb-4 hide-scrollbar">
              {mockPlants.map((plant) => (
                <div key={plant.id} className="w-48 flex-shrink-0 snap-center">
                  <div className="group relative block overflow-hidden rounded-2xl bg-card">
                    <div className="h-48 w-full bg-muted relative overflow-hidden">
                      <img 
                        src={plant.imageUrl} 
                        alt={plant.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                    <div className="absolute bottom-0 p-4 text-white">
                      <p className="text-lg font-bold">{plant.name}</p>
                      <p className="text-sm opacity-80">Level {plant.level}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditModalOpen(false);
            }
          }}
        >
          <div className="bg-card rounded-2xl shadow-lg w-full max-w-md min-h-0 my-8 flex flex-col">
            {/* Fixed Header */}
            <div className="flex items-center justify-between border-b border-border p-4 flex-shrink-0">
              <h3 className="text-xl font-bold">Edit Profile</h3>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <form className="p-6 space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden">
                      <div 
                        className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
                        style={{ 
                          background: `linear-gradient(135deg, ${colors.sage} 0%, ${colors.mint} 100%)`
                        }}
                      >
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <label className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90">
                      <Camera className="h-4 w-4" />
                      <input className="hidden" type="file" accept="image/*" />
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-base font-medium text-foreground mb-2" htmlFor="username">Username</label>
                  <input 
                    id="username"
                    name="username"
                    className="w-full rounded-xl border-0 bg-secondary px-4 py-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-0"
                    type="text"
                    placeholder="flora_grows"
                    defaultValue="flora_grows"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-foreground mb-2" htmlFor="name">Name</label>
                  <input 
                    id="name"
                    name="name"
                    className="w-full rounded-xl border-0 bg-secondary px-4 py-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-0"
                    type="text"
                    placeholder="Your display name"
                    defaultValue={userName}
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-foreground mb-2" htmlFor="bio">Bio</label>
                  <textarea 
                    id="bio"
                    name="bio"
                    className="w-full rounded-xl border-0 bg-secondary px-4 py-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-0 resize-none"
                    rows={3}
                    placeholder="Lover of all things green and growing!"
                    defaultValue={userBio}
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-foreground mb-2" htmlFor="email">Email</label>
                  <input 
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="w-full rounded-xl border-0 bg-secondary px-4 py-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-0"
                    placeholder="you@example.com"
                    defaultValue={user?.email || ""}
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-foreground mb-2" htmlFor="phone">Phone Number</label>
                  <input 
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full rounded-xl border-0 bg-secondary px-4 py-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-0"
                    placeholder="+1 (555) 123-4567"
                    defaultValue=""
                  />
                </div>

                <div className="pt-4 pb-2">
                  <button 
                    type="submit"
                    className="w-full rounded-full bg-primary px-4 py-3 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditModalOpen(false);
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
