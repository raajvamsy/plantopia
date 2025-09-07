'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  dismissible?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  }, [removeToast]);

  const showSuccess = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'success', duration, dismissible: true });
  }, [addToast]);

  const showError = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'error', duration: duration || 7000, dismissible: true });
  }, [addToast]);

  const showWarning = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'warning', duration, dismissible: true });
  }, [addToast]);

  const showInfo = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'info', duration, dismissible: true });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(onRemove, 300); // Wait for animation to complete
  };

  const typeConfig = {
    success: {
      icon: CheckCircle,
      className: 'bg-green-50 text-green-800 border-green-200',
      iconClassName: 'text-green-600',
    },
    error: {
      icon: AlertCircle,
      className: 'bg-red-50 text-red-800 border-red-200',
      iconClassName: 'text-red-600',
    },
    warning: {
      icon: AlertCircle,
      className: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      iconClassName: 'text-yellow-600',
    },
    info: {
      icon: Info,
      className: 'bg-blue-50 text-blue-800 border-blue-200',
      iconClassName: 'text-blue-600',
    },
  };

  const config = typeConfig[toast.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-lg p-4 border shadow-lg backdrop-blur-sm',
        'transform transition-all duration-300 ease-out',
        'flex items-start gap-3',
        config.className,
        isVisible
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.iconClassName)} />
      <span className="flex-1 text-sm font-medium leading-relaxed">
        {toast.message}
      </span>
      {toast.dismissible && (
        <button
          onClick={handleRemove}
          className={cn(
            'flex-shrink-0 hover:opacity-70 transition-all duration-200',
            'p-1 rounded-full hover:bg-black/5',
            config.iconClassName
          )}
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// Named exports only - no default export to avoid conflicts
