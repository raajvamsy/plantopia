'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PlantCardProps {
  id: string;
  name: string;
  health: number;
  moisture: number;
  sunlight: number;
  imageUrl: string;
  onClick?: () => void;
  className?: string;
}

export default function PlantCard({
  id,
  name,
  health,
  moisture,
  sunlight,
  imageUrl,
  onClick,
  className,
}: PlantCardProps) {
  return (
    <div
      className={cn(
        "flex-shrink-0 snap-center cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="bg-card rounded-xl sm:rounded-2xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out border border-border w-full">
        <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${name} plant`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 256px"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="text-foreground text-base sm:text-lg font-bold mb-1 truncate">{name}</h3>
          <p className="text-muted-foreground text-xs sm:text-sm leading-tight">
            Health: {health}% | Moisture: {moisture}% | Sunlight: {sunlight}%
          </p>
        </div>
      </div>
    </div>
  );
}
