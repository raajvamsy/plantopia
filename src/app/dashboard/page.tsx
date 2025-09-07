'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { PlantService, TaskService, AchievementService } from '@/lib/supabase/services';
import { usePlantColors } from '@/lib/theme';
import type { Plant, Task, Achievement } from '@/types/api';
import { 
  Droplets, 
  Leaf as LeafIcon,
  Trophy,
  CloudSun
} from 'lucide-react';
import PlantCard from '@/components/ui/plant-card';
import TaskItem from '@/components/ui/task-item';
import ProgressBar from '@/components/ui/progress-bar';
import { AuthGuard } from '@/components/common/auth-guard';
import { PageLayout } from '@/components/common/page-layout';
import { SectionHeader } from '@/components/common/section-header';
import { EmptyState } from '@/components/common/empty-state';
import { LeafSpinner } from '@/components/ui';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useSupabaseAuth();
  const colors = usePlantColors();
  
  // Plant data state
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Task and challenge data state
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [challenges, setChallenges] = useState<Achievement[]>([]);

  // Load dashboard data from Supabase
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const plantsData = await PlantService.getUserPlants(user!.id);
      setPlants(plantsData);
      
      // Fetch pending tasks
      const tasksData = await TaskService.getUserTasks(user!.id, 'pending');
      setDailyTasks(tasksData || []);
      
      // Fetch user achievements (challenges)
      const achievementsData = await AchievementService.getUserAchievements(user!.id);
      setChallenges(achievementsData || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const userName = user?.email?.split('@')[0] || 'Plant Lover';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <AuthGuard>
      <PageLayout currentPage="dashboard" className="py-4 sm:py-8 min-h-full">
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
          <SectionHeader
            title="My Plants"
            action={
              <button
                onClick={() => router.push('/plants')}
                className="text-primary hover:text-primary/80 text-sm sm:text-base font-medium transition-colors flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            }
          />
          <div className="overflow-x-auto">
            <div className="flex gap-3 sm:gap-4 px-1 sm:px-4 pb-2 min-w-max">
              {isLoading ? (
                <LeafSpinner size="lg" showText={true} text="Loading plants..." />
              ) : plants.length > 0 ? (
                plants.map((plant) => (
                  <div key={plant.id} className="flex-shrink-0">
                    <PlantCard
                      id={plant.id}
                      name={plant.name}
                      health={plant.health}
                      moisture={plant.moisture}
                      sunlight={plant.sunlight}
                      imageUrl={plant.image_url || '/api/placeholder/400/300'}
                      onClick={() => router.push(`/plants/${plant.id}`)}
                      className="w-56 sm:w-64"
                    />
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={LeafIcon}
                  title="No plants yet"
                  description="Start growing your garden!"
                  action={
                    <button
                      onClick={() => router.push('/plants')}
                      className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add Your First Plant
                    </button>
                  }
                />
              )}
            </div>
          </div>
        </section>

        {/* Daily Tasks and Challenges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Daily Tasks */}
          <section>
            <SectionHeader title="Daily Tasks" />
            <div className="space-y-3 px-1 sm:px-0">
              {dailyTasks.length > 0 ? (
                dailyTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    icon={Droplets}
                    title={task.title || 'Plant Care Task'}
                    description={task.description || 'Complete this task to help your plants grow'}
                    completed={task.status === 'completed'}
                    onClick={() => console.log(`Clicked on task: ${task.title}`)}
                  />
                ))
              ) : (
                <EmptyState
                  title="No pending tasks"
                  description="Your plants are well cared for!"
                />
              )}
            </div>
          </section>

          {/* Challenges */}
          <section>
            <SectionHeader title="Challenges" />
            <div className="space-y-3 px-1 sm:px-0">
              {challenges.length > 0 ? (
                challenges.map((challenge) => (
                  <TaskItem
                    key={challenge.id}
                    icon={Trophy}
                    title={challenge.title || 'Achievement'}
                    description={challenge.description || 'Complete this challenge to earn rewards'}
                    completed={challenge.completed}
                    onClick={() => console.log(`Clicked on challenge: ${challenge.title}`)}
                  />
                ))
              ) : (
                <EmptyState
                  title="No challenges yet"
                  description="Keep growing plants to unlock them!"
                />
              )}
            </div>
          </section>
        </div>

        {/* Progress Section
        <section className="bg-card p-4 sm:p-6 rounded-2xl shadow-sm border border-border mx-1 sm:mx-0">
          <SectionHeader title="Reward Bloom Progress" />
          <ProgressBar value={60} />
        </section> */}
      </PageLayout>
    </AuthGuard>
  );
}
