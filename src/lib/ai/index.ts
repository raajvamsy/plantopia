// AI Services Index - Plantopia PWA
// This file exports all AI-related services and utilities

import { GeminiAIService } from './gemini-service';
export { GeminiAIService };
export { 
  AI_PROMPTS, 
  formatPrompt, 
  getSystemPrompt, 
  getResponseFormat,
  validatePromptVariables,
  type AIPromptType,
  type PromptTemplate
} from './prompts';

// Re-export AI service from supabase services for convenience
export { AIService } from '@/lib/supabase/services/ai';

// AI Service Status Check
export async function checkAIServiceStatus() {
  const geminiStatus = GeminiAIService.getStatus();
  
  return {
    gemini: geminiStatus,
    overall: geminiStatus.ready,
    message: geminiStatus.ready 
      ? 'AI services are ready' 
      : !geminiStatus.apiKeyPresent 
        ? 'Gemini API key not configured'
        : 'AI services not initialized'
  };
}

// Initialize all AI services
export async function initializeAIServices(): Promise<boolean> {
  try {
    const geminiInitialized = GeminiAIService.initialize();
    
    if (geminiInitialized) {
      console.log('✅ All AI services initialized successfully');
      return true;
    } else {
      console.error('❌ Failed to initialize AI services');
      return false;
    }
  } catch (error) {
    console.error('❌ Error initializing AI services:', error);
    return false;
  }
}

// Test AI services connectivity
export async function testAIServices(): Promise<{
  gemini: boolean;
  overall: boolean;
}> {
  try {
    const geminiTest = await GeminiAIService.testConnection();
    
    return {
      gemini: geminiTest,
      overall: geminiTest
    };
  } catch (error) {
    console.error('❌ Error testing AI services:', error);
    return {
      gemini: false,
      overall: false
    };
  }
}
