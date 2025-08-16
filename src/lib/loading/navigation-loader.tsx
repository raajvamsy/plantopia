'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLoading } from './context';

export default function NavigationLoader() {
  const { showLoading, hideLoading } = useLoading();
  const pathname = usePathname();
  
  // Track navigation loading
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleStart = () => {
      // Small delay to avoid flicker on fast navigations
      timeout = setTimeout(() => {
        showLoading('Navigating...', 'Loading your page');
      }, 100);
    };

    const handleComplete = () => {
      clearTimeout(timeout);
      hideLoading();
    };

    // Listen for programmatic navigation
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    window.history.pushState = function(...args) {
      handleStart();
      return originalPush.apply(this, args);
    };

    window.history.replaceState = function(...args) {
      handleStart();
      return originalReplace.apply(this, args);
    };

    // Listen for browser back/forward
    const handlePopState = () => {
      handleStart();
      // Navigation will complete when pathname changes
    };

    window.addEventListener('popstate', handlePopState);

    // Clean up loading when pathname changes (navigation complete)
    const cleanupTimeout = setTimeout(() => {
      handleComplete();
    }, 50);

    return () => {
      clearTimeout(timeout);
      clearTimeout(cleanupTimeout);
      window.removeEventListener('popstate', handlePopState);
      
      // Restore original methods
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
    };
  }, [pathname, showLoading, hideLoading]);

  return null;
}
