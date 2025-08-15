'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage for remembered session
        const savedUser = localStorage.getItem('plantopia-user');
        const sessionToken = localStorage.getItem('plantopia-token');
        
        if (savedUser && sessionToken) {
          // In a real app, you'd validate the token with your backend
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (
    email: string, 
    password: string, 
    rememberMe: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, this would call your backend
      if (email && password.length >= 6) {
        const userData: User = {
          id: '1',
          email,
          username: email.split('@')[0],
          name: 'Plant Lover'
        };
        
        const mockToken = 'mock-jwt-token';
        
        setUser(userData);
        
        if (rememberMe) {
          localStorage.setItem('plantopia-user', JSON.stringify(userData));
          localStorage.setItem('plantopia-token', mockToken);
        } else {
          // Use sessionStorage for temporary sessions
          sessionStorage.setItem('plantopia-user', JSON.stringify(userData));
          sessionStorage.setItem('plantopia-token', mockToken);
        }
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (
    email: string, 
    password: string, 
    username: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock signup - replace with actual logic
      if (email && password.length >= 6 && username) {
        const userData: User = {
          id: Date.now().toString(),
          email,
          username,
          name: username
        };
        
        setUser(userData);
        
        const mockToken = 'mock-jwt-token';
        localStorage.setItem('plantopia-user', JSON.stringify(userData));
        localStorage.setItem('plantopia-token', mockToken);
        
        return { success: true };
      } else {
        return { success: false, error: 'Please check your information and try again' };
      }
    } catch (error) {
      return { success: false, error: 'Signup failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email) {
        return { success: true };
      } else {
        return { success: false, error: 'Please enter a valid email address' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to send reset email. Please try again.' };
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('plantopia-user');
    localStorage.removeItem('plantopia-token');
    sessionStorage.removeItem('plantopia-user');
    sessionStorage.removeItem('plantopia-token');
  }, []);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
