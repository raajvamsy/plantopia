'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import { 
  Plus, 
  ArrowLeft, 
  Settings,
  Trash2,
  Archive,
  RotateCcw
} from 'lucide-react';
import BottomNavigation from '@/components/ui/bottom-navigation';

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
            ? 'bg-zinc-800 opacity-50' 
            : 'bg-zinc-800 hover:shadow-xl'
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
          plant.isArchived ? 'text-zinc-400' : 'text-white'
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
            className="rounded-full bg-black/50 p-2 text-white hover:bg-black/75 transition-colors"
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
              className="rounded-full bg-black/50 p-2 text-white hover:bg-black/75 transition-colors"
              title="Delete plant"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive?.(plant.id);
              }}
              className="rounded-full bg-black/50 p-2 text-white hover:bg-black/75 transition-colors"
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
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-700 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-emerald-500">
              <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6 11h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5V6a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"></path>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm5-9c0-1.38-1.12-2.5-2.5-2.5S9.5 7.12 9.5 8.5h-2c0-2.48 2.02-4.5 4.5-4.5s4.5 2.02 4.5 4.5h-2z" fillOpacity="0.3"></path>
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zM7.17 14.17a3.5 3.5 0 0 1 0-4.95l1.42 1.42a1.5 1.5 0 0 0 0 2.12l-1.42 1.41zm9.66 0a3.5 3.5 0 0 1-4.95 0l1.42-1.41a1.5 1.5 0 0 0 2.12 0l1.41 1.41zM12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z" opacity="0.6"></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold">Bloomscape</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
            <button className="flex items-center justify-center w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors">
              <Settings className="w-5 h-5 text-zinc-400" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-900">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-3xl font-bold lg:text-4xl">My Plants</h2>
            <button 
              onClick={() => router.push('/capture')}
              className="bg-emerald-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-emerald-600 flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              <span>Add New Plant</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-zinc-700">
            <nav className="-mb-px flex space-x-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors duration-300 ${
                    activeCategory === category.id
                      ? 'text-emerald-500 border-emerald-500'
                      : 'text-zinc-400 border-transparent hover:text-white hover:border-zinc-600'
                  }`}
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
              <h2 className="mb-6 text-2xl font-bold">Archived Plants</h2>
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
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
