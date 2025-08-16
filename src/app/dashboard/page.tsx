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
import PlantCard from '@/components/ui/plant-card';
import TaskItem from '@/components/ui/task-item';
import ProgressBar from '@/components/ui/progress-bar';
import BottomNavigation from '@/components/ui/bottom-navigation';

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div 
                className="size-6 sm:size-8 flex items-center justify-center flex-shrink-0"
                style={{ color: colors.sage }}
              >
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <g clipPath="url(#clip0_6_535)">
                    <path 
                      clipRule="evenodd" 
                      d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" 
                      fill="currentColor" 
                      fillRule="evenodd"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6_535">
                      <rect fill="white" height="48" width="48" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h1 className="text-foreground text-lg sm:text-2xl font-bold tracking-tighter">Plantopia</h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-muted hover:bg-muted/80 rounded-full transition-colors">
                <Settings className="h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground" />
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full overflow-hidden flex-shrink-0">
                <div 
                  className="w-full h-full bg-gradient-to-br from-sage to-mint flex items-center justify-center text-white font-bold text-sm sm:text-base"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.sage} 0%, ${colors.mint} 100%)`
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24">
        <div className="max-w-4xl mx-auto">
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
            <h3 className="text-foreground text-xl sm:text-2xl font-bold px-1 sm:px-4 mb-3 sm:mb-4">My Plants</h3>
            <div className="overflow-x-auto">
              <div className="flex gap-3 sm:gap-4 px-1 sm:px-4 pb-2 min-w-max">
                {plants.map((plant) => (
                  <div key={plant.id} className="flex-shrink-0">
                    <PlantCard
                      {...plant}
                      onClick={() => console.log(`Clicked on ${plant.name}`)}
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
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
