'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { usePlantColors } from '@/lib/theme';
import { 
  Settings, 
  Droplets, 
  Sun, 
  Leaf as LeafIcon,
  Trophy,
  Heart,
  CloudSun
} from 'lucide-react';
import { 
  PlantCard, 
  TaskItem, 
  ProgressBar, 
  BottomNavigation, 
  PlantopiaHeader,
  MobilePageWrapper,
  ResponsiveContainer
} from '@/components/ui';

// Mock data for plants
const plants = [
  {
    id: '1',
    name: 'Rose',
    health: 90,
    moisture: 75,
    sunlight: 80,
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&auto=format',
  },
  {
    id: '2',
    name: 'Basil',
    health: 85,
    moisture: 60,
    sunlight: 70,
    imageUrl: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400&h=300&fit=crop&auto=format',
  },
  {
    id: '3',
    name: 'Lavender',
    health: 95,
    moisture: 80,
    sunlight: 90,
    imageUrl: 'https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400&h=300&fit=crop&auto=format',
  },
  {
    id: '4',
    name: 'Mint',
    health: 88,
    moisture: 70,
    sunlight: 65,
    imageUrl: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=400&h=300&fit=crop&auto=format',
  },
];

// Mock data for daily tasks
const dailyTasks = [
  {
    id: '1',
    icon: Droplets,
    title: 'Water your plants',
    description: 'Give them a refreshing drink!',
    completed: false,
  },
  {
    id: '2',
    icon: Sun,
    title: 'Check sunlight levels',
    description: 'Find the perfect sunny spot.',
    completed: true,
  },
  {
    id: '3',
    icon: LeafIcon,
    title: 'Monitor soil moisture',
    description: 'Keep the soil perfectly damp.',
    completed: false,
  },
];

// Mock data for challenges
const challenges = [
  {
    id: '1',
    icon: Trophy,
    title: 'Task Master',
    description: 'Complete 3 daily tasks',
    completed: false,
  },
  {
    id: '2',
    icon: Heart,
    title: 'Plant Care Pro',
    description: 'Maintain plant health above 80%',
    completed: true,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const colors = usePlantColors();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return null; // or loading spinner
  }

  const userName = user.name || user.username || 'Plant Lover';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <MobilePageWrapper>
      <PlantopiaHeader currentPage="dashboard" />
      <ResponsiveContainer maxWidth="4xl" padding="lg" className="py-4 sm:py-8 min-h-full">
          {/* Greeting Section */}
          <div className="px-1 sm:px-4 mb-6 sm:mb-8">
            <h2 className="text-foreground text-2xl sm:text-3xl font-bold leading-tight">
              {greeting}, {userName}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mt-1 flex items-center gap-2">
              <CloudSun className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Sunny, 22°C</span>
            </p>
          </div>

          {/* My Plants Section */}
          <section className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between px-1 sm:px-4 mb-3 sm:mb-4">
              <h3 className="text-foreground text-xl sm:text-2xl font-bold">My Plants</h3>
              <button
                onClick={() => router.push('/plants')}
                className="text-primary hover:text-primary/80 text-sm sm:text-base font-medium transition-colors flex items-center gap-1"
                style={{ color: colors.sage }}
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-3 sm:gap-4 px-1 sm:px-4 pb-2 min-w-max">
                {plants.map((plant) => (
                  <div key={plant.id} className="flex-shrink-0">
                    <PlantCard
                      {...plant}
                      onClick={() => router.push(`/plants/${plant.id}`)}
                      className="w-56 sm:w-64"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Daily Tasks and Challenges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Daily Tasks */}
            <section>
              <h3 className="text-foreground text-xl sm:text-2xl font-bold px-1 sm:px-4 mb-3 sm:mb-4">Daily Tasks</h3>
              <div className="space-y-3 px-1 sm:px-0">
                {dailyTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    icon={task.icon}
                    title={task.title}
                    description={task.description}
                    completed={task.completed}
                    onClick={() => console.log(`Clicked on task: ${task.title}`)}
                  />
                ))}
              </div>
            </section>

            {/* Challenges */}
            <section>
              <h3 className="text-foreground text-xl sm:text-2xl font-bold px-1 sm:px-4 mb-3 sm:mb-4">Challenges</h3>
              <div className="space-y-3 px-1 sm:px-0">
                {challenges.map((challenge) => (
                  <TaskItem
                    key={challenge.id}
                    icon={challenge.icon}
                    title={challenge.title}
                    description={challenge.description}
                    completed={challenge.completed}
                    onClick={() => console.log(`Clicked on challenge: ${challenge.title}`)}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Progress Section */}
          <section className="bg-card p-4 sm:p-6 rounded-2xl shadow-sm border border-border mx-1 sm:mx-0">
            <h3 className="text-foreground text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Reward Bloom Progress</h3>
            <ProgressBar value={60} />
          </section>
      </ResponsiveContainer>
      <BottomNavigation />
    </MobilePageWrapper>
  );
}
