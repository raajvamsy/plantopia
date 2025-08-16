'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { usePlantColors } from '@/lib/theme';
import BottomNavigation from '@/components/ui/bottom-navigation';
import PlantopiaHeader from '@/components/ui/plantopia-header';

export default function CommunityPage() {
  const colors = usePlantColors();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PlantopiaHeader currentPage="community" showBackButton={true} />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div 
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colors.sage}20` }}
          >
            <Users className="h-12 w-12" style={{ color: colors.sage }} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Plant Community
          </h2>
          <p className="text-muted-foreground mb-8">
            Connect with fellow plant enthusiasts, share your green journey, and get advice from experienced gardeners.
          </p>
          <button
            className="px-8 py-3 rounded-full font-medium text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
            style={{ backgroundColor: colors.sage }}
          >
            Coming Soon
          </button>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
