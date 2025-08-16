'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import { usePlantColors } from '@/lib/theme';
import { 
  Settings, 
  ArrowLeft, 
  Bell,
  Award,
  Sprout,
  Leaf,
  Heart,
  Star,
  Trophy,
  Camera
} from 'lucide-react';
import TabNavigation from '@/components/ui/tab-navigation';
import AchievementCard from '@/components/ui/achievement-card';
import BottomNavigation from '@/components/ui/bottom-navigation';
import PlantopiaHeader from '@/components/ui/plantopia-header';

// Mock plant data
const plantsData = {
  '1': {
    id: '1',
    name: 'Rose',
    health: 90,
    moisture: 75,
    sunlight: 80,
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&auto=format',
    heroImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop&auto=format',
  },
  '2': {
    id: '2',
    name: 'Basil',
    health: 85,
    moisture: 60,
    sunlight: 70,
    imageUrl: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=800&h=600&fit=crop&auto=format',
    heroImageUrl: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=1200&h=600&fit=crop&auto=format',
  },
  '3': {
    id: '3',
    name: 'Lavender',
    health: 95,
    moisture: 80,
    sunlight: 90,
    imageUrl: 'https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=800&h=600&fit=crop&auto=format',
    heroImageUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&h=600&fit=crop&auto=format',
  },
  '4': {
    id: '4',
    name: 'Mint',
    health: 88,
    moisture: 70,
    sunlight: 65,
    imageUrl: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=800&h=600&fit=crop&auto=format',
    heroImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop&auto=format',
  },
};

// Mock achievements data
const achievements = [
  {
    id: '1',
    title: 'First Sprout',
    icon: <Sprout className="w-6 h-6" />,
    completed: true,
  },
  {
    id: '2',
    title: 'Healthy Growth',
    icon: <Leaf className="w-6 h-6" />,
    completed: true,
  },
  {
    id: '3',
    title: 'Blooming Beauty',
    icon: <Heart className="w-6 h-6" />,
    completed: false,
  },
  {
    id: '4',
    title: 'Green Thumb',
    icon: <Star className="w-6 h-6" />,
    completed: true,
  },
  {
    id: '5',
    title: 'Plant Whisperer',
    icon: <Award className="w-6 h-6" />,
    completed: false,
  },
  {
    id: '6',
    title: 'Botanical Master',
    icon: <Trophy className="w-6 h-6" />,
    completed: false,
  },
];

export default function PlantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const colors = usePlantColors();
  const [activeTab, setActiveTab] = useState('growth-history');

  const plantId = params.id as string;
  const plant = plantsData[plantId as keyof typeof plantsData];

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user || !plant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Plant not found</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const userName = user.name || user.username || 'Plant Lover';

  const tabs = [
    { id: 'growth-history', label: 'Growth History', isActive: activeTab === 'growth-history' },
    { id: 'gemini-logs', label: 'Gemini Logs', isActive: activeTab === 'gemini-logs' },
    { id: 'care-plan', label: 'Care Plan', isActive: activeTab === 'care-plan' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PlantopiaHeader currentPage="plant" showBackButton={true} customTitle={plant?.name} />

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="relative w-full h-64 bg-muted rounded-2xl overflow-hidden shadow-lg mb-6">
            <Image
              src={plant.heroImageUrl}
              alt={`${plant.name} detail view`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold">{plant.name}</h2>
              <p className="text-sm sm:text-base opacity-90">
                Health: {plant.health}% • Moisture: {plant.moisture}% • Sun: {plant.sunlight}%
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <TabNavigation
              tabs={tabs}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {activeTab === 'growth-history' && (
              <div className="space-y-4">
                <h3 className="text-foreground text-xl sm:text-2xl font-bold">Growth History</h3>
                <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                  <p className="text-muted-foreground">Track your plant&apos;s growth journey over time. Photos, measurements, and milestones will appear here.</p>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <Camera className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <Camera className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <Camera className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <Camera className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'gemini-logs' && (
              <div className="space-y-4">
                <h3 className="text-foreground text-xl sm:text-2xl font-bold">Gemini Logs</h3>
                <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                  <p className="text-muted-foreground">AI-powered insights and recommendations for your plant care will appear here.</p>
                </div>
              </div>
            )}
            
            {activeTab === 'care-plan' && (
              <div className="space-y-4">
                <h3 className="text-foreground text-xl sm:text-2xl font-bold">Care Plan</h3>
                <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                  <p className="text-muted-foreground">Personalized care schedule and instructions for optimal plant health.</p>
                </div>
              </div>
            )}
          </div>

          {/* Achievements Section */}
          <div>
            <h3 className="text-foreground text-xl sm:text-2xl font-bold mb-4">Achievements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  title={achievement.title}
                  icon={achievement.icon}
                  completed={achievement.completed}
                  onClick={() => console.log(`Achievement clicked: ${achievement.title}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

