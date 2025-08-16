'use client';

import React from 'react';
import { usePlantColors } from '@/lib/theme';

interface LeafSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  text?: string;
  subText?: string;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16', 
  lg: 'w-24 h-24',
  xl: 'w-32 h-32'
};

const leafSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-6 h-6', 
  xl: 'w-8 h-8'
};

export default function LeafSpinner({ 
  size = 'md', 
  className = '',
  showText = false,
  text = 'Loading...',
  subText = ''
}: LeafSpinnerProps) {
  const colors = usePlantColors();
  
  const spinnerSize = sizeClasses[size];
  const leafSize = leafSizes[size];
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${spinnerSize}`}>
        {/* Custom CSS for leaf animation */}
        <style jsx>{`
          .leaf-spinner {
            position: relative;
            width: 100%;
            height: 100%;
          }
          
          .spinner-leaf {
            position: absolute;
            top: 50%;
            left: 50%;
            border-radius: 50% 0;
            transform-origin: center;
            animation: grow-and-rotate 2s infinite ease-in-out;
          }
          
          .spinner-leaf:nth-child(1) {
            background-color: ${colors.sage};
            animation-delay: -0.2s;
          }
          
          .spinner-leaf:nth-child(2) {
            background-color: ${colors.mint};
            animation-delay: -0.4s;
          }
          
          .spinner-leaf:nth-child(3) {
            background-color: #48BB78;
            animation-delay: -0.6s;
          }
          
          .spinner-leaf:nth-child(4) {
            background-color: #68D391;
            animation-delay: -0.8s;
          }
          
          .spinner-leaf:nth-child(5) {
            background-color: ${colors.sage};
            animation-delay: -1s;
          }
          
          @keyframes grow-and-rotate {
            0% {
              transform: translate(-50%, -50%) scale(0) rotate(0deg) translateX(0px);
              opacity: 1;
            }
            50% {
              transform: translate(-50%, -50%) scale(1) rotate(180deg) translateX(${size === 'sm' ? '12px' : size === 'md' ? '16px' : size === 'lg' ? '20px' : '26px'});
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(0) rotate(360deg) translateX(0px);
              opacity: 0;
            }
          }
        `}</style>
        
        <div className="leaf-spinner">
          <div className={`spinner-leaf ${leafSize}`}></div>
          <div className={`spinner-leaf ${leafSize}`}></div>
          <div className={`spinner-leaf ${leafSize}`}></div>
          <div className={`spinner-leaf ${leafSize}`}></div>
          <div className={`spinner-leaf ${leafSize}`}></div>
        </div>
      </div>
      
      {showText && (
        <div className="mt-4 text-center">
          <p className="text-gray-800 font-medium text-sm">{text}</p>
          {subText && (
            <p className="text-gray-500 text-xs mt-1">{subText}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Export named variants for common use cases
export const AIAnalyzingSpinner = () => (
  <LeafSpinner 
    size="lg" 
    showText={true}
    text="Analyzing with AI"
    subText="Identifying your plant..."
  />
);

export const LoadingSpinner = () => (
  <LeafSpinner 
    size="md" 
    showText={true}
    text="Loading..."
  />
);

export const PlantingSpinner = () => (
  <LeafSpinner 
    size="xl"
    showText={true} 
    text="Planting the seeds..."
    subText="Your digital garden is waking up."
    className="text-white"
  />
);
