'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { PlantService } from '@/lib/supabase/services';
import { usePlantColors } from '@/lib/theme';
import type { Plant } from '@/types/api';
import { 
  Plus, 
  ArrowLeft, 
  Settings,
  Trash2,
  Archive,
  RotateCcw,
  Leaf as LeafIcon
} from 'lucide-react';
import { 
  AuthGuard, 
  PageLayout, 
  SectionHeader, 
  EmptyState,
  PrimaryButton
} from '@/components/common';
import { LeafSpinner } from '@/components/ui';

export default function PlantsPage() {
  const router = useRouter();
  const { user } = useSupabaseAuth();
  const colors = usePlantColors();
  const [activeCategory, setActiveCategory] = useState('all');

  // Plant data state
  const [activePlants, setActivePlants] = useState<Plant[]>([]);
  const [archivedPlants, setArchivedPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All', isActive: true },
    { id: 'indoor', label: 'Indoor', isActive: false },
    { id: 'outdoor', label: 'Outdoor', isActive: false },
    { id: 'herbs', label: 'Herbs', isActive: false },
    { id: 'succulents', label: 'Succulents', isActive: false },
  ];

interface PlantCardProps {
  plant: Plant;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onClick?: () => void;
}

function PlantCard({ plant, onArchive, onDelete, onRestore, onClick }: PlantCardProps) {
  return (
    <div className="group relative cursor-pointer" onClick={onClick}>
      <div 
        className={`aspect-square w-full overflow-hidden rounded-lg transition-all duration-300 ${
          plant.is_archived 
            ? 'bg-muted opacity-50' 
            : 'bg-muted hover:shadow-xl'
        }`}
      >
        <Image
          src={plant.image_url || '/api/placeholder/400/300'}
          alt={plant.name}
          fill
          className={`object-cover object-center transition-transform duration-300 ${
            plant.is_archived ? '' : 'group-hover:scale-110'
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>
      <h3 
        className={`mt-2 text-sm font-semibold ${
          plant.is_archived ? 'text-muted-foreground' : 'text-foreground'
        }`}
      >
        {plant.name}
      </h3>
      
      {/* Action buttons */}
      <div 
        className={`absolute flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
          plant.is_archived ? 'top-2 right-2' : 'top-2 right-2'
        }`}
      >
        {plant.is_archived ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestore?.(plant.id);
            }}
            className="rounded-full bg-black/50 p-2 text-primary-foreground hover:bg-black/75 transition-colors"
            title="Restore plant"
          >
            <RotateCcw size={16} />
          </button>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(plant.id);
              }}
              className="rounded-full bg-black/50 p-2 text-primary-foreground hover:bg-black/75 transition-colors"
              title="Delete plant"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive?.(plant.id);
              }}
              className="rounded-full bg-black/50 p-2 text-primary-foreground hover:bg-black/75 transition-colors"
              title="Archive plant"
            >
              <Archive size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

  // Load plants data from Supabase
  useEffect(() => {
    if (user) {
      loadPlantsData();
    }
  }, [user]);

  const loadPlantsData = async () => {
    try {
      setIsLoading(true);
      const [activeData, archivedData] = await Promise.all([
        PlantService.getUserPlants(user!.id, false),
        PlantService.getUserPlants(user!.id, true)
      ]);
      setActivePlants(activeData);
      setArchivedPlants(archivedData);
    } catch (err) {
      console.error('Error loading plants data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleArchivePlant = (plantId: string) => {
    const plantToArchive = activePlants.find(p => p.id === plantId);
    if (!plantToArchive) return;

    setActivePlants(prev => prev.filter(p => p.id !== plantId));
    setArchivedPlants(prev => [...prev, { ...plantToArchive, is_archived: true }]);
  };

  const handleDeletePlant = (plantId: string) => {
    setActivePlants(prev => prev.filter(p => p.id !== plantId));
  };

  const handleRestorePlant = (plantId: string) => {
    const plantToRestore = archivedPlants.find(p => p.id === plantId);
    if (!plantToRestore) return;

    setArchivedPlants(prev => prev.filter(p => p.id !== plantId));
    setActivePlants(prev => [...prev, { ...plantToRestore, is_archived: false }]);
  };

  const filteredActivePlants = activeCategory === 'all' 
    ? activePlants 
    : activePlants.filter(plant => plant.category === activeCategory);

  return (
    <AuthGuard>
      <PageLayout currentPage="plants" className="py-4 sm:py-8 min-h-full">
        {/* Page Header */}
        <SectionHeader
          title="My Plants"
          action={
            <PrimaryButton
              onClick={() => router.push('/capture')}
              icon={<Plus size={20} />}
            >
              Add New Plant
            </PrimaryButton>
          }
        />

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-border">
            <nav className="-mb-px flex space-x-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors duration-300 ${
                    activeCategory === category.id
                      ? 'border-primary'
                      : 'text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground'
                  }`}
                  style={{ 
                    color: activeCategory === category.id ? colors.sage : undefined,
                    borderColor: activeCategory === category.id ? colors.sage : undefined
                  }}
                >
                  {category.label}
                </button>
              ))}
            </nav>
          </div>

        {/* Active Plants Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mb-12">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-8">
              <LeafSpinner size="lg" showText={true} text="Loading plants..." />
            </div>
          ) : filteredActivePlants.length > 0 ? (
            filteredActivePlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onArchive={handleArchivePlant}
                onDelete={handleDeletePlant}
                onClick={() => router.push(`/plants/${plant.id}`)}
              />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                icon={LeafIcon}
                title="No plants found"
                description="Start growing your collection!"
                action={
                  <PrimaryButton
                    onClick={() => router.push('/capture')}
                    icon={<Plus size={20} />}
                  >
                    Add Your First Plant
                  </PrimaryButton>
                }
              />
            </div>
          )}
        </div>

        {/* Archived Plants */}
        {archivedPlants.length > 0 && (
          <div>
            <SectionHeader title="Archived Plants" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {archivedPlants.map((plant) => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  onRestore={handleRestorePlant}
                  onClick={() => router.push(`/plants/${plant.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </PageLayout>
    </AuthGuard>
  );
}
