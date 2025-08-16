'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { plantCategories } from '@/lib/data/plants';

interface PlantFilterDropdownProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export default function PlantFilterDropdown({ 
  selectedCategory, 
  onCategoryChange, 
  className 
}: PlantFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  const displayText = selectedCategory === 'All Plants' ? 'Filter by Plant' : selectedCategory;

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background text-sm font-medium text-foreground shadow-sm hover:bg-secondary"
      >
        <Filter className="text-muted-foreground h-4 w-4" />
        <span>{displayText}</span>
        <ChevronDown className={cn(
          "text-muted-foreground h-4 w-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-background shadow-lg z-50">
          <div className="p-1">
            {plantCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  selectedCategory === category
                    ? "bg-sage text-white"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <div className="flex h-4 w-4 items-center justify-center">
                  {selectedCategory === category && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
