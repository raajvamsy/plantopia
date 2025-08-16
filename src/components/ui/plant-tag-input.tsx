'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { searchPlants, Plant } from '@/lib/data/plants';

interface PlantTagInputProps {
  selectedPlants: Plant[];
  onPlantsChange: (plants: Plant[]) => void;
  className?: string;
  placeholder?: string;
}

export default function PlantTagInput({ 
  selectedPlants, 
  onPlantsChange, 
  className,
  placeholder = "Search for plants" 
}: PlantTagInputProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Plant[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle search input changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchPlants(searchQuery).filter(
        plant => !selectedPlants.some(selected => selected.id === plant.id)
      );
      setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setActiveSuggestion(-1);
  }, [searchQuery, selectedPlants]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddPlant = (plant: Plant) => {
    onPlantsChange([...selectedPlants, plant]);
    setSearchQuery('');
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    inputRef.current?.focus();
  };

  const handleRemovePlant = (plantToRemove: Plant) => {
    onPlantsChange(selectedPlants.filter(plant => plant.id !== plantToRemove.id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestion(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestion >= 0 && activeSuggestion < suggestions.length) {
          handleAddPlant(suggestions[activeSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        break;
    }
  };

  return (
    <div className={cn('space-y-3', className)} ref={containerRef}>
      {/* Selected Plants - Chips */}
      {selectedPlants.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedPlants.map((plant) => (
            <div
              key={plant.id}
              className="inline-flex items-center gap-1 rounded-full bg-sage/20 text-sage border border-sage/30 px-3 py-1 text-sm font-medium"
            >
              <span>{plant.name}</span>
              <button
                onClick={() => handleRemovePlant(plant)}
                className="hover:bg-sage/30 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${plant.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="rounded-full border-gray-600 bg-gray-800 py-3 pl-12 pr-4 text-base text-white placeholder:text-gray-400 focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-gray-900"
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
          <Search className="h-5 w-5" />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {suggestions.map((plant, index) => (
              <button
                key={plant.id}
                onClick={() => handleAddPlant(plant)}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0",
                  activeSuggestion === index && "bg-gray-700"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{plant.name}</p>
                    {plant.scientificName && (
                      <p className="text-gray-400 text-sm italic">{plant.scientificName}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full bg-gray-600 px-2 py-1 text-xs font-medium text-gray-300">
                      {plant.category}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
