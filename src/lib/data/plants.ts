// Sample plant data for filtering and tagging
export interface Plant {
  id: string;
  name: string;
  scientificName?: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isPopular?: boolean;
}

export const samplePlants: Plant[] = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    category: 'Tropical',
    difficulty: 'Easy',
    isPopular: true,
  },
  {
    id: '2',
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    category: 'Tree',
    difficulty: 'Medium',
    isPopular: true,
  },
  {
    id: '3',
    name: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    category: 'Succulent',
    difficulty: 'Easy',
    isPopular: true,
  },
  {
    id: '4',
    name: 'Pothos',
    scientificName: 'Epipremnum aureum',
    category: 'Tropical',
    difficulty: 'Easy',
    isPopular: true,
  },
  {
    id: '5',
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum',
    category: 'Flowering',
    difficulty: 'Easy',
  },
  {
    id: '6',
    name: 'Rubber Tree',
    scientificName: 'Ficus elastica',
    category: 'Tree',
    difficulty: 'Easy',
  },
  {
    id: '7',
    name: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    category: 'Tropical',
    difficulty: 'Easy',
  },
  {
    id: '8',
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis',
    category: 'Succulent',
    difficulty: 'Easy',
  },
  {
    id: '9',
    name: 'Bird of Paradise',
    scientificName: 'Strelitzia reginae',
    category: 'Tropical',
    difficulty: 'Medium',
  },
  {
    id: '10',
    name: 'Philodendron',
    scientificName: 'Philodendron hederaceum',
    category: 'Tropical',
    difficulty: 'Easy',
  },
];

export const plantCategories = [
  'All Plants',
  'Tropical',
  'Succulent', 
  'Tree',
  'Flowering',
];

// Helper functions
export const searchPlants = (query: string): Plant[] => {
  if (!query.trim()) return samplePlants;
  
  const lowercaseQuery = query.toLowerCase();
  return samplePlants.filter(plant => 
    plant.name.toLowerCase().includes(lowercaseQuery) ||
    plant.scientificName?.toLowerCase().includes(lowercaseQuery) ||
    plant.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const filterPlantsByCategory = (category: string): Plant[] => {
  if (category === 'All Plants') return samplePlants;
  return samplePlants.filter(plant => plant.category === category);
};

export const getPopularPlants = (): Plant[] => {
  return samplePlants.filter(plant => plant.isPopular);
};
