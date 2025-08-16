'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PlantopiaLoader } from '@/components/ui';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  subMessage?: string;
}

interface LoadingContextType {
  isLoading: boolean;
  message?: string;
  subMessage?: string;
  showLoading: (message?: string, subMessage?: string) => void;
  hideLoading: () => void;
  withLoading: <T>(
    promise: Promise<T>, 
    message?: string, 
    subMessage?: string
  ) => Promise<T>;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: undefined,
    subMessage: undefined,
  });

  const showLoading = useCallback((message?: string, subMessage?: string) => {
    setLoadingState({
      isLoading: true,
      message,
      subMessage,
    });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
      message: undefined,
      subMessage: undefined,
    });
  }, []);

  const withLoading = useCallback(async <T,>(
    promise: Promise<T>,
    message?: string,
    subMessage?: string
  ): Promise<T> => {
    showLoading(message, subMessage);
    try {
      const result = await promise;
      return result;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const contextValue: LoadingContextType = {
    isLoading: loadingState.isLoading,
    message: loadingState.message,
    subMessage: loadingState.subMessage,
    showLoading,
    hideLoading,
    withLoading,
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      
      {/* Global Loading Overlay */}
      {loadingState.isLoading && (
        <PlantopiaLoader 
          text={loadingState.message}
          subText={loadingState.subMessage}
        />
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
