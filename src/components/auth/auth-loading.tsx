'use client';

import React from 'react';
import { PlantingSpinner } from '@/components/ui';

interface AuthLoadingProps {
  message?: string;
  subMessage?: string;
}

export default function AuthLoading({ 
  message = "Loading Plantopia...",
  subMessage = "Preparing your plant journey"
}: AuthLoadingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center overflow-hidden">
      <div className="text-center px-8">
        {/* Logo/Brand area */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Plantopia</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
        </div>
        
        <PlantingSpinner />
        
        <div className="mt-8">
          <p className="text-white text-lg font-semibold tracking-wide">{message}</p>
          <p className="text-gray-400 text-sm mt-2">{subMessage}</p>
        </div>
      </div>
    </div>
  );
}

