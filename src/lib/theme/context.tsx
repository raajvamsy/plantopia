'use client';

import React, { createContext, useCallback, useEffect, useState } from 'react';
import { ThemeContextType, ThemeMode, PlantopiaTheme } from './types';
import { createPlantopiaTheme, defaultTheme } from './config';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface PlantopiaThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export const PlantopiaThemeProvider: React.FC<PlantopiaThemeProviderProps> = ({
  children,
  defaultMode = 'system',
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultMode);
  const [currentTheme, setCurrentTheme] = useState<PlantopiaTheme>(defaultTheme);

  // Function to get system theme preference
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  // Function to apply theme to document
  const applyThemeToDocument = useCallback((theme: PlantopiaTheme) => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      const isDark = theme.mode === 'dark' || (theme.mode === 'system' && getSystemTheme() === 'dark');
      
      // Add/remove dark class
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Set custom CSS properties for Plantopia colors
      root.style.setProperty('--plantopia-sage', theme.colors.sage);
      root.style.setProperty('--plantopia-mint', theme.colors.mint);
      root.style.setProperty('--plantopia-moss', theme.colors.moss);
      root.style.setProperty('--plantopia-fern', theme.colors.fern);
      root.style.setProperty('--plantopia-leaf', theme.colors.leaf);
      root.style.setProperty('--plantopia-earth', theme.colors.earth);
      root.style.setProperty('--plantopia-bark', theme.colors.bark);
      root.style.setProperty('--plantopia-stone', theme.colors.stone);
      root.style.setProperty('--plantopia-sky', theme.colors.sky);
      root.style.setProperty('--plantopia-water', theme.colors.water);
      
      // Update primary color to use sage
      root.style.setProperty('--primary', theme.colors.primary);
      root.style.setProperty('--accent', theme.colors.accent);
      root.style.setProperty('--ring', theme.colors.ring);
    }
  }, [getSystemTheme]);

  // Update theme when mode changes
  useEffect(() => {
    const resolvedMode = themeMode === 'system' ? getSystemTheme() : themeMode;
    const newTheme = createPlantopiaTheme(resolvedMode);
    setCurrentTheme(newTheme);
    applyThemeToDocument(newTheme);
  }, [themeMode, getSystemTheme, applyThemeToDocument]);

  // Listen for system theme changes
  useEffect(() => {
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const resolvedMode = getSystemTheme();
        const newTheme = createPlantopiaTheme(resolvedMode);
        setCurrentTheme(newTheme);
        applyThemeToDocument(newTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode, getSystemTheme, applyThemeToDocument]);

  // Load saved theme preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('plantopia-theme') as ThemeMode;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeMode(savedTheme);
      }
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('plantopia-theme', themeMode);
    }
  }, [themeMode]);

  const setTheme = useCallback((newMode: ThemeMode) => {
    setThemeMode(newMode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      // If system, toggle to the opposite of current system preference
      return getSystemTheme() === 'dark' ? 'light' : 'dark';
    });
  }, [getSystemTheme]);

  const contextValue: ThemeContextType = {
    theme: currentTheme,
    setTheme,
    toggleTheme,
    isDark: currentTheme.mode === 'dark' || (currentTheme.mode === 'system' && getSystemTheme() === 'dark'),
    isLight: currentTheme.mode === 'light' || (currentTheme.mode === 'system' && getSystemTheme() === 'light'),
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
