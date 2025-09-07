// Gemini 2.5 Flash Lite Service for Plantopia PWA
// This service handles all AI interactions using Google's Gemini 2.5 Flash Lite model

import { GoogleGenAI } from '@google/genai';
import { 
  AI_PROMPTS, 
  formatPrompt, 
  getSystemPrompt, 
  validatePromptVariables,
  type AIPromptType 
} from './prompts';
import type {
  PlantIdentificationRequest,
  PlantIdentificationResponse,
  CareAdviceRequest,
  CareAdviceResponse,
  DiseaseDetectionRequest,
  DiseaseDetectionResponse,
  GeneralChatRequest,
  GeneralChatResponse,
} from '@/types/api';

// ============================================================================
// GEMINI SERVICE CONFIGURATION
// ============================================================================

interface GeminiConfig {
  temperature: number;
  thinkingConfig: {
    thinkingBudget: number;
  };
  responseMimeType: string;
}

const DEFAULT_CONFIG: GeminiConfig = {
  temperature: 0.3, // Slightly creative but mostly factual
  thinkingConfig: {
    thinkingBudget: 0,
  },
  responseMimeType: 'application/json',
};

const MODEL_NAME = 'gemini-2.5-flash-lite';

// ============================================================================
// GEMINI AI SERVICE CLASS
// ============================================================================

export class GeminiAIService {
  private static ai: GoogleGenAI | null = null;
  private static isInitialized = false;

  // Initialize the Gemini AI service
  static initialize(): boolean {
    try {
      // Check if we're on client-side and already initialized
      if (typeof window !== 'undefined' && this.isInitialized) {
        console.log('✅ Gemini AI service already initialized (client-side check)');
        return true;
      }

      const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      // Debug environment variables
      console.log('🔍 Gemini Environment Variables Debug:', {
        NODE_ENV: process.env.NODE_ENV,
        isClientSide: typeof window !== 'undefined',
        hasGeminiApiKey: !!process.env.GEMINI_API_KEY,
        hasPublicGeminiApiKey: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        geminiKeyLength: apiKey ? apiKey.length : 0,
        geminiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'undefined',
        allGeminiKeys: Object.keys(process.env).filter(key => key.includes('GEMINI'))
      });
      
      if (!apiKey) {
        // If we're on client-side and no public key, that's expected
        if (typeof window !== 'undefined') {
          console.log('ℹ️ Client-side: Gemini API key not available (this is expected for security)');
          return this.isInitialized; // Return current state
        }
        console.error('❌ Gemini API key not found. Please set GEMINI_API_KEY environment variable.');
        return false;
      }

      this.ai = new GoogleGenAI({
        apiKey: apiKey,
      });

      this.isInitialized = true;
      console.log('✅ Gemini AI service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Gemini AI service:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // Check if service is ready
  static isReady(): boolean {
    return this.isInitialized && this.ai !== null;
  }

  // Generic method to call Gemini API
  private static async callGemini(
    promptType: AIPromptType,
    variables: Record<string, string>,
    config: Partial<GeminiConfig> = {}
  ): Promise<string | null> {
    try {
      if (!this.isReady()) {
        console.error('❌ Gemini AI service not initialized');
        return null;
      }

      const template = AI_PROMPTS[promptType];
      
      // Validate required variables
      const missingVars = validatePromptVariables(template, variables);
      if (missingVars.length > 0) {
        console.error('❌ Missing required variables:', missingVars);
        return null;
      }

      // Format the prompt
      const userPrompt = formatPrompt(template, variables);
      const systemPrompt = getSystemPrompt(template);

      // Prepare the request
      const finalConfig = { ...DEFAULT_CONFIG, ...config };
      
      const contents = [
        {
          role: 'user' as const,
          parts: [
            {
              text: `${systemPrompt}\n\n${userPrompt}`,
            },
          ],
        },
      ];

      console.log('🤖 Calling Gemini API for:', promptType);
      
      // Call Gemini API
      const response = await this.ai!.models.generateContentStream({
        model: MODEL_NAME,
        config: finalConfig,
        contents,
      });

      let fullResponse = '';
      for await (const chunk of response) {
        if (chunk.text) {
          fullResponse += chunk.text;
        }
      }

      if (!fullResponse.trim()) {
        console.error('❌ Empty response from Gemini API');
        return null;
      }

      console.log('✅ Gemini API response received');
      return fullResponse.trim();
    } catch (error) {
      console.error('❌ Error calling Gemini API:', error);
      return null;
    }
  }

  // Parse JSON response safely
  private static parseJSONResponse<T>(response: string): T | null {
    try {
      // Clean up the response - remove any markdown formatting
      let cleanResponse = response.trim();
      
      // Remove markdown code blocks if present
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      return JSON.parse(cleanResponse) as T;
    } catch (error) {
      console.error('❌ Failed to parse JSON response:', error);
      console.error('Raw response:', response);
      return null;
    }
  }

  // ============================================================================
  // PLANT IDENTIFICATION
  // ============================================================================

  static async identifyPlant(request: PlantIdentificationRequest): Promise<PlantIdentificationResponse | null> {
    try {
      const variables = {
        user_message: request.user_message || 'Please identify this plant from the image.',
        image_url: request.image_url,
      };

      const response = await this.callGemini('PLANT_IDENTIFICATION', variables);
      if (!response) return null;

      const parsed = this.parseJSONResponse<PlantIdentificationResponse>(response);
      if (!parsed) return null;

      // Validate required fields
      if (!parsed.species || typeof parsed.confidence !== 'number') {
        console.error('❌ Invalid plant identification response format');
        return null;
      }

      // Ensure confidence is between 0 and 1
      parsed.confidence = Math.max(0, Math.min(1, parsed.confidence));

      return parsed;
    } catch (error) {
      console.error('❌ Error in plant identification:', error);
      return null;
    }
  }

  // ============================================================================
  // CARE ADVICE
  // ============================================================================

  static async getCareAdvice(request: CareAdviceRequest): Promise<CareAdviceResponse | null> {
    try {
      const variables = {
        plant_species: request.plant_species || 'Unknown species',
        user_message: request.user_message,
        plant_id: request.plant_id || 'No plant ID provided',
        symptoms: request.symptoms?.join(', ') || 'No specific symptoms mentioned',
      };

      const response = await this.callGemini('CARE_ADVICE', variables);
      if (!response) return null;

      const parsed = this.parseJSONResponse<CareAdviceResponse>(response);
      if (!parsed) return null;

      // Validate required fields
      if (!parsed.advice || !parsed.priority || typeof parsed.confidence !== 'number') {
        console.error('❌ Invalid care advice response format');
        return null;
      }

      // Ensure confidence is between 0 and 1
      parsed.confidence = Math.max(0, Math.min(1, parsed.confidence));

      return parsed;
    } catch (error) {
      console.error('❌ Error in care advice:', error);
      return null;
    }
  }

  // ============================================================================
  // DISEASE DETECTION
  // ============================================================================

  static async detectDisease(request: DiseaseDetectionRequest): Promise<DiseaseDetectionResponse | null> {
    try {
      const variables = {
        plant_species: request.plant_species || 'Unknown species',
        symptoms_description: request.symptoms_description,
        image_url: request.image_url,
        has_image: request.image_url ? 'Yes' : 'No',
      };

      const response = await this.callGemini('DISEASE_DETECTION', variables);
      if (!response) return null;

      const parsed = this.parseJSONResponse<DiseaseDetectionResponse>(response);
      if (!parsed) return null;

      // Validate required fields
      if (!parsed.disease_name || !parsed.severity || typeof parsed.confidence !== 'number') {
        console.error('❌ Invalid disease detection response format');
        return null;
      }

      // Ensure confidence is between 0 and 1
      parsed.confidence = Math.max(0, Math.min(1, parsed.confidence));

      return parsed;
    } catch (error) {
      console.error('❌ Error in disease detection:', error);
      return null;
    }
  }

  // ============================================================================
  // GENERAL CHAT
  // ============================================================================

  static async generalChat(request: GeneralChatRequest): Promise<GeneralChatResponse | null> {
    try {
      const userPlants = request.context?.user_plants || [];
      const recentTasks = request.context?.recent_tasks || [];

      const variables = {
        message: request.message,
        plant_count: userPlants.length.toString(),
        recent_plants: userPlants.slice(0, 5).map(p => p.name).join(', ') || 'No plants',
        recent_tasks: recentTasks.slice(0, 3).map(t => t.title).join(', ') || 'No recent tasks',
      };

      const response = await this.callGemini('GENERAL_CHAT', variables);
      if (!response) return null;

      const parsed = this.parseJSONResponse<GeneralChatResponse>(response);
      if (!parsed) return null;

      // Validate required fields
      if (!parsed.response) {
        console.error('❌ Invalid general chat response format');
        return null;
      }

      return parsed;
    } catch (error) {
      console.error('❌ Error in general chat:', error);
      return null;
    }
  }

  // ============================================================================
  // SEASONAL CARE ADVICE
  // ============================================================================

  static async getSeasonalAdvice(
    season: string,
    location: string,
    plantTypes: string[],
    userMessage: string
  ): Promise<Record<string, unknown> | null> {
    try {
      const variables = {
        season,
        location,
        plant_types: plantTypes.join(', '),
        user_message: userMessage,
      };

      const response = await this.callGemini('SEASONAL_CARE', variables);
      if (!response) return null;

      return this.parseJSONResponse(response);
    } catch (error) {
      console.error('❌ Error in seasonal advice:', error);
      return null;
    }
  }

  // ============================================================================
  // PLANT RECOMMENDATIONS
  // ============================================================================

  static async getPlantRecommendations(
    lightConditions: string,
    space: string,
    experience: string,
    preferences: string,
    lifestyle: string,
    specialRequirements: string = ''
  ): Promise<Record<string, unknown> | null> {
    try {
      const variables = {
        light_conditions: lightConditions,
        space,
        experience,
        preferences,
        lifestyle,
        special_requirements: specialRequirements,
      };

      const response = await this.callGemini('PLANT_RECOMMENDATION', variables);
      if (!response) return null;

      return this.parseJSONResponse(response);
    } catch (error) {
      console.error('❌ Error in plant recommendations:', error);
      return null;
    }
  }

  // ============================================================================
  // TROUBLESHOOTING
  // ============================================================================

  static async troubleshootPlant(
    plantName: string,
    problemDescription: string,
    timeline: string,
    recentChanges: string
  ): Promise<Record<string, unknown> | null> {
    try {
      const variables = {
        plant_name: plantName,
        problem_description: problemDescription,
        timeline,
        recent_changes: recentChanges,
      };

      const response = await this.callGemini('TROUBLESHOOTING', variables);
      if (!response) return null;

      return this.parseJSONResponse(response);
    } catch (error) {
      console.error('❌ Error in plant troubleshooting:', error);
      return null;
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  // Test the connection to Gemini API
  static async testConnection(): Promise<boolean> {
    try {
      if (!this.isReady()) {
        return false;
      }

      const testResponse = await this.generalChat({
        message: 'Hello, can you help me with plant care?',
        context: { user_plants: [], recent_tasks: [] }
      });

      return testResponse !== null;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }

  // Get service status
  static getStatus(): {
    initialized: boolean;
    apiKeyPresent: boolean;
    ready: boolean;
  } {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    // On client-side, we can't check for server-side env vars
    const apiKeyPresent = typeof window !== 'undefined' 
      ? this.isInitialized // If initialized, assume key was present
      : !!apiKey;
    
    return {
      initialized: this.isInitialized,
      apiKeyPresent,
      ready: this.isReady(),
    };
  }
}

// ============================================================================
// AUTO-INITIALIZE
// ============================================================================

// Auto-initialize the service when the module is loaded
if (typeof window === 'undefined') {
  // Server-side initialization
  GeminiAIService.initialize();
} else {
  // Client-side initialization (if needed)
  // Note: Be careful with API keys on client-side
  console.log('🤖 Gemini AI service loaded on client-side');
}
