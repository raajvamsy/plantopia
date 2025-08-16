'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import { usePlantColors } from '@/lib/theme';
import { 
  Plus, 
  ArrowLeft, 
  Settings,
  Trash2,
  Archive,
  RotateCcw
} from 'lucide-react';
import { 
  BottomNavigation, 
  PlantopiaHeader,
  MobilePageWrapper,
  ResponsiveContainer
} from '@/components/ui';

// Mock data for plants
const activePlants = [
  {
    id: '1',
    name: 'Fiddle Leaf Fig',
    category: 'indoor',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop&auto=format',
    isArchived: false,
  },
  {
    id: '2',
    name: 'Snake Plant',
    category: 'indoor',
    imageUrl: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400&h=400&fit=crop&auto=format',
    isArchived: false,
  },
  {
    id: '3',
    name: 'Peace Lily',
    category: 'indoor',
    imageUrl: 'https://images.unsplash.com/photo-1591958911259-bee2173bdac4?w=400&h=400&fit=crop&auto=format',
    isArchived: false,
  },
  {
    id: '4',
    name: 'Monstera',
    category: 'indoor',
    imageUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=400&h=400&fit=crop&auto=format',
    isArchived: false,
  },
  {
    id: '5',
    name: 'Basil',
    category: 'herbs',
    imageUrl: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400&h=400&fit=crop&auto=format',
    isArchived: false,
  },
  {
    id: '6',
    name: 'Aloe Vera',
    category: 'succulents',
    imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f2360af203?w=400&h=400&fit=crop&auto=format',
    isArchived: false,
  },
];

const archivedPlants = [
  {
    id: '7',
    name: 'Rosemary',
    category: 'herbs',
    imageUrl: 'https://images.unsplash.com/photo-1515665793325-32d5d7a6b8b7?w=400&h=400&fit=crop&auto=format',
    isArchived: true,
  },
  {
    id: '8',
    name: 'Lavender',
    category: 'herbs',
    imageUrl: 'https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400&h=400&fit=crop&auto=format',
    isArchived: true,
  },
];

const categories = [
  { id: 'all', label: 'All', isActive: true },
  { id: 'indoor', label: 'Indoor', isActive: false },
  { id: 'outdoor', label: 'Outdoor', isActive: false },
  { id: 'herbs', label: 'Herbs', isActive: false },
  { id: 'succulents', label: 'Succulents', isActive: false },
];

interface PlantCardProps {
  plant: {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    isArchived: boolean;
  };
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
          plant.isArchived 
            ? 'bg-muted opacity-50' 
            : 'bg-muted hover:shadow-xl'
        }`}
      >
        <Image
          src={plant.imageUrl}
          alt={plant.name}
          fill
          className={`object-cover object-center transition-transform duration-300 ${
            plant.isArchived ? '' : 'group-hover:scale-110'
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>
      <h3 
        className={`mt-2 text-sm font-semibold ${
          plant.isArchived ? 'text-muted-foreground' : 'text-foreground'
        }`}
      >
        {plant.name}
      </h3>
      
      {/* Action buttons */}
      <div 
        className={`absolute flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
          plant.isArchived ? 'top-2 right-2' : 'top-2 right-2'
        }`}
      >
        {plant.isArchived ? (
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

export default function PlantsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const colors = usePlantColors();
  const [activeCategory, setActiveCategory] = useState('all');
  const [plants, setPlants] = useState({
    active: activePlants,
    archived: archivedPlants,
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return null;
  }

  const userName = user.name || user.username || 'Plant Lover';

  const handleArchivePlant = (plantId: string) => {
    setPlants(prev => {
      const plantToArchive = prev.active.find(p => p.id === plantId);
      if (!plantToArchive) return prev;

      return {
        active: prev.active.filter(p => p.id !== plantId),
        archived: [...prev.archived, { ...plantToArchive, isArchived: true }],
      };
    });
  };

  const handleDeletePlant = (plantId: string) => {
    setPlants(prev => ({
      ...prev,
      active: prev.active.filter(p => p.id !== plantId),
    }));
  };

  const handleRestorePlant = (plantId: string) => {
    setPlants(prev => {
      const plantToRestore = prev.archived.find(p => p.id === plantId);
      if (!plantToRestore) return prev;

      return {
        active: [...prev.active, { ...plantToRestore, isArchived: false }],
        archived: prev.archived.filter(p => p.id !== plantId),
      };
    });
  };

  const filteredActivePlants = activeCategory === 'all' 
    ? plants.active 
    : plants.active.filter(plant => plant.category === activeCategory);

  return (
    <MobilePageWrapper>
      <PlantopiaHeader currentPage="plants" />
      <ResponsiveContainer maxWidth="6xl" padding="lg" className="py-4 sm:py-8 min-h-full">
          {/* Page Header */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-foreground text-3xl font-bold lg:text-4xl">My Plants</h2>
            <button 
              onClick={() => router.push('/capture')}
              className="font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg text-primary-foreground"
              style={{ backgroundColor: colors.sage }}
            >
              <Plus size={20} />
              <span>Add New Plant</span>
            </button>
          </div>

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
            {filteredActivePlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onArchive={handleArchivePlant}
                onDelete={handleDeletePlant}
                onClick={() => router.push(`/plants/${plant.id}`)}
              />
            ))}
          </div>

          {/* Archived Plants */}
          {plants.archived.length > 0 && (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-foreground">Archived Plants</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {plants.archived.map((plant) => (
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
      </ResponsiveContainer>
      <BottomNavigation />
    </MobilePageWrapper>
  );
}
