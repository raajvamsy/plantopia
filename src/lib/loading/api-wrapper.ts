import { useLoading, LoadingContext } from './context';
import { useContext } from 'react';

// Hook for wrapping API calls with loading states
export function useApiCall() {
  const context = useContext(LoadingContext);
  
  // If no loading context is available, provide fallback functions
  if (!context) {
    console.warn('useApiCall: LoadingProvider not found, using fallback');
    
    return {
      apiCall: async <T>(
        apiFunction: () => Promise<T>,
        loadingMessage?: string,
        subMessage?: string
      ): Promise<T> => apiFunction(),
      
      fetchData: async <T>(
        fetchFunction: () => Promise<T>,
        dataType?: string
      ): Promise<T> => fetchFunction(),
      
      saveData: async <T>(
        saveFunction: () => Promise<T>,
        dataType?: string
      ): Promise<T> => saveFunction(),
      
      deleteData: async <T>(
        deleteFunction: () => Promise<T>,
        dataType?: string
      ): Promise<T> => deleteFunction(),
      
      uploadFile: async <T>(
        uploadFunction: () => Promise<T>,
        fileName?: string
      ): Promise<T> => uploadFunction(),
      
      processImage: async <T>(
        processFunction: () => Promise<T>
      ): Promise<T> => processFunction(),
    };
  }
  
  const { withLoading } = context;

  return {
    // Generic API call wrapper
    apiCall: async <T>(
      apiFunction: () => Promise<T>,
      loadingMessage?: string,
      subMessage?: string
    ): Promise<T> => {
      return withLoading(apiFunction, loadingMessage, subMessage);
    },

    // Specific API wrappers for common operations
    fetchData: async <T>(
      fetchFunction: () => Promise<T>,
      dataType?: string
    ): Promise<T> => {
      return withLoading(
        fetchFunction,
        `Loading ${dataType || 'data'}...`,
        'Please wait while we fetch your information'
      );
    },

    saveData: async <T>(
      saveFunction: () => Promise<T>,
      dataType?: string
    ): Promise<T> => {
      return withLoading(
        saveFunction,
        `Saving ${dataType || 'data'}...`,
        'Please wait while we save your changes'
      );
    },

    deleteData: async <T>(
      deleteFunction: () => Promise<T>,
      dataType?: string
    ): Promise<T> => {
      return withLoading(
        deleteFunction,
        `Deleting ${dataType || 'item'}...`,
        'This action cannot be undone'
      );
    },

    uploadFile: async <T>(
      uploadFunction: () => Promise<T>,
      fileName?: string
    ): Promise<T> => {
      return withLoading(
        uploadFunction,
        `Uploading ${fileName || 'file'}...`,
        'Please keep this page open while uploading'
      );
    },

    processImage: async <T>(
      processFunction: () => Promise<T>
    ): Promise<T> => {
      return withLoading(
        processFunction,
        'Analyzing image...',
        'AI is identifying your plant'
      );
    },
  };
}

// Standalone functions for use outside of React components
export class ApiLoader {
  private static instance: ApiLoader;
  private loadingContext: any;

  private constructor() {}

  static getInstance(): ApiLoader {
    if (!ApiLoader.instance) {
      ApiLoader.instance = new ApiLoader();
    }
    return ApiLoader.instance;
  }

  setLoadingContext(context: any) {
    this.loadingContext = context;
  }

  async withLoading<T>(
    apiFunction: () => Promise<T>,
    message?: string,
    subMessage?: string
  ): Promise<T> {
    if (this.loadingContext) {
      return this.loadingContext.withLoading(apiFunction, message, subMessage);
    }
    // Fallback to direct execution if no loading context
    return apiFunction();
  }
}

// Utility functions for common API patterns
export const apiLoadingMessages = {
  auth: {
    login: { message: 'Signing you in...', subMessage: 'Authenticating your credentials' },
    signup: { message: 'Creating your account...', subMessage: 'Setting up your digital garden' },
    logout: { message: 'Signing you out...', subMessage: 'Saving your session' },
    forgotPassword: { message: 'Sending reset email...', subMessage: 'Please check your inbox' },
  },
  plants: {
    fetch: { message: 'Loading your plants...', subMessage: 'Gathering your garden data' },
    analyze: { message: 'Analyzing plant...', subMessage: 'AI is identifying species and health' },
    save: { message: 'Adding plant...', subMessage: 'Saving to your collection' },
    delete: { message: 'Removing plant...', subMessage: 'Updating your garden' },
    update: { message: 'Updating plant...', subMessage: 'Saving your changes' },
  },
  profile: {
    update: { message: 'Updating profile...', subMessage: 'Saving your information' },
    uploadAvatar: { message: 'Uploading photo...', subMessage: 'Processing your image' },
  },
  navigation: {
    default: { message: 'Loading...', subMessage: 'Preparing your page' },
  },
};
