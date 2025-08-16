'use client';

import React from 'react';
import { PlantingSpinner } from './leaf-spinner';

interface FullPageLoaderProps {
  text?: string;
  subText?: string;
}

export default function FullPageLoader({ 
  text = "Planting the seeds...",
  subText = "Your digital garden is waking up."
}: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-800 overflow-hidden">
      <div className="text-center">
        <PlantingSpinner />
      </div>
    </div>
  );
}

// Alternative with custom styling
export function PlantopiaLoader({ 
  text = "Loading Plantopia...",
  subText = "Preparing your plant collection"
}: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center overflow-hidden">
      <div className="text-center px-8">
        {/* Logo/Brand area could go here */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Plantopia</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
        </div>
        
        <PlantingSpinner />
        
        <div className="mt-8">
          <p className="text-white text-lg font-semibold tracking-wide">{text}</p>
          <p className="text-gray-400 text-sm mt-2">{subText}</p>
        </div>
      </div>
    </div>
  );
}
