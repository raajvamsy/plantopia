import { supabase } from '../config';
import { GeminiAIService } from '@/lib/ai/gemini-service';
import type { 
  AIInteraction, 
  AIInteractionInsert, 
  AIInteractionUpdate,
  AIInteractionType,
  PlantIdentificationRequest,
  PlantIdentificationResponse,
  CareAdviceRequest,
  CareAdviceResponse,
  DiseaseDetectionRequest,
  DiseaseDetectionResponse,
  GeneralChatRequest,
  GeneralChatResponse
} from '@/types/api';

export class AIService {
  // Enhanced error handling wrapper
  private static handleDatabaseError(error: unknown, operation: string): void {
    const errorObj = error as { message?: string; code?: string; details?: string; hint?: string };
    console.error(`❌ ${operation} error:`, {
      message: errorObj?.message,
      code: errorObj?.code,
      details: errorObj?.details,
      hint: errorObj?.hint
    });
  }

  // Get all AI interactions for a user
  static async getUserAIInteractions(
    userId: string, 
    interactionType?: AIInteractionType,
    limit: number = 50
  ): Promise<AIInteraction[]> {
    try {
      if (!userId) {
        console.warn('⚠️  getUserAIInteractions called with empty userId');
        return [];
      }

      let query = supabase
        .from('ai_interactions')
        .select('*')
        .eq('user_id', userId);

      if (interactionType) {
        query = query.eq('interaction_type', interactionType);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(Math.min(limit, 100));

      if (error) {
        this.handleDatabaseError(error, 'Get user AI interactions');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in getUserAIInteractions:', error);
      return [];
    }
  }

  // Get AI interaction by ID
  static async getAIInteractionById(interactionId: string): Promise<AIInteraction | null> {
    try {
      if (!interactionId) {
        console.warn('⚠️  getAIInteractionById called with empty interactionId');
        return null;
      }

      const { data, error } = await supabase
        .from('ai_interactions')
        .select('*')
        .eq('id', interactionId)
        .single();

      if (error) {
        if ((error as { code?: string })?.code === 'PGRST116') {
          console.log('ℹ️  No AI interaction found with ID:', interactionId);
          return null;
        }
        this.handleDatabaseError(error, 'Get AI interaction by ID');
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Exception in getAIInteractionById:', error);
      return null;
    }
  }

  // Create new AI interaction
  static async createAIInteraction(interactionData: Omit<AIInteractionInsert, 'id'>): Promise<AIInteraction | null> {
    try {
      // Validate required fields
      if (!interactionData.user_id || !interactionData.interaction_type || 
          !interactionData.user_message || !interactionData.ai_response) {
        console.error('❌ createAIInteraction called with missing required fields:', interactionData);
        return null;
      }

      // Normalize data
      const normalizedData = {
        ...interactionData,
        user_message: interactionData.user_message.trim(),
        ai_response: interactionData.ai_response.trim(),
        confidence_score: interactionData.confidence_score ? 
          Math.max(0, Math.min(1, interactionData.confidence_score)) : null,
      };

      const { data, error } = await supabase
        .from('ai_interactions')
        .insert(normalizedData)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Create AI interaction');
        return null;
      }

      console.log('✅ AI interaction created successfully:', data.interaction_type);
      return data;
    } catch (error) {
      console.error('❌ Exception in createAIInteraction:', error);
      return null;
    }
  }

  // Update AI interaction
  static async updateAIInteraction(
    interactionId: string, 
    updates: AIInteractionUpdate
  ): Promise<AIInteraction | null> {
    try {
      if (!interactionId) {
        console.error('❌ updateAIInteraction called with empty interactionId');
        return null;
      }

      if (!updates || Object.keys(updates).length === 0) {
        console.warn('⚠️  updateAIInteraction called with no updates');
        return await this.getAIInteractionById(interactionId);
      }

      // Normalize update data
      const normalizedUpdates: AIInteractionUpdate = { ...updates };
      
      if (updates.user_message) {
        normalizedUpdates.user_message = updates.user_message.trim();
      }
      
      if (updates.ai_response) {
        normalizedUpdates.ai_response = updates.ai_response.trim();
      }
      
      if (updates.confidence_score !== undefined && updates.confidence_score !== null) {
        normalizedUpdates.confidence_score = Math.max(0, Math.min(1, updates.confidence_score));
      }

      const { data, error } = await supabase
        .from('ai_interactions')
        .update(normalizedUpdates)
        .eq('id', interactionId)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Update AI interaction');
        return null;
      }

      console.log('✅ AI interaction updated successfully');
      return data;
    } catch (error) {
      console.error('❌ Exception in updateAIInteraction:', error);
      return null;
    }
  }

  // Delete AI interaction
  static async deleteAIInteraction(interactionId: string, userId: string): Promise<boolean> {
    try {
      if (!interactionId || !userId) {
        console.warn('⚠️  deleteAIInteraction called with empty parameters');
        return false;
      }

      // Ensure user can only delete their own interactions
      const { error } = await supabase
        .from('ai_interactions')
        .delete()
        .eq('id', interactionId)
        .eq('user_id', userId);

      if (error) {
        this.handleDatabaseError(error, 'Delete AI interaction');
        return false;
      }

      console.log('✅ AI interaction deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception in deleteAIInteraction:', error);
      return false;
    }
  }

  // Get AI interactions for a specific plant
  static async getPlantAIInteractions(plantId: string, limit: number = 20): Promise<AIInteraction[]> {
    try {
      if (!plantId) {
        console.warn('⚠️  getPlantAIInteractions called with empty plantId');
        return [];
      }

      const { data, error } = await supabase
        .from('ai_interactions')
        .select('*')
        .eq('plant_id', plantId)
        .order('created_at', { ascending: false })
        .limit(Math.min(limit, 50));

      if (error) {
        this.handleDatabaseError(error, 'Get plant AI interactions');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in getPlantAIInteractions:', error);
      return [];
    }
  }

  // Search AI interactions by content
  static async searchAIInteractions(
    userId: string, 
    query: string, 
    interactionType?: AIInteractionType,
    limit: number = 20
  ): Promise<AIInteraction[]> {
    try {
      if (!userId || !query || query.trim().length === 0) {
        console.warn('⚠️  searchAIInteractions called with invalid parameters');
        return [];
      }

      const normalizedQuery = query.trim();
      
      let dbQuery = supabase
        .from('ai_interactions')
        .select('*')
        .eq('user_id', userId)
        .or(`user_message.ilike.%${normalizedQuery}%,ai_response.ilike.%${normalizedQuery}%`);

      if (interactionType) {
        dbQuery = dbQuery.eq('interaction_type', interactionType);
      }

      const { data, error } = await dbQuery
        .order('created_at', { ascending: false })
        .limit(Math.min(limit, 50));

      if (error) {
        this.handleDatabaseError(error, 'Search AI interactions');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in searchAIInteractions:', error);
      return [];
    }
  }

  // Get AI interaction statistics
  static async getAIInteractionStats(userId: string): Promise<{
    totalInteractions: number;
    interactionsByType: Record<AIInteractionType, number>;
    averageConfidence: number;
    recentInteractionsCount: number;
  }> {
    try {
      if (!userId) {
        console.warn('⚠️  getAIInteractionStats called with empty userId');
        return {
          totalInteractions: 0,
          interactionsByType: {
            plant_identification: 0,
            care_advice: 0,
            disease_diagnosis: 0,
            general_chat: 0
          },
          averageConfidence: 0,
          recentInteractionsCount: 0
        };
      }

      const interactions = await this.getUserAIInteractions(userId);
      
      const totalInteractions = interactions.length;
      
      const interactionsByType = interactions.reduce((acc, interaction) => {
        acc[interaction.interaction_type] = (acc[interaction.interaction_type] || 0) + 1;
        return acc;
      }, {} as Record<AIInteractionType, number>);
      
      // Ensure all types are present
      const allTypes: AIInteractionType[] = ['plant_identification', 'care_advice', 'disease_diagnosis', 'general_chat'];
      allTypes.forEach(type => {
        if (!(type in interactionsByType)) {
          interactionsByType[type] = 0;
        }
      });
      
      const confidenceScores = interactions
        .map(i => i.confidence_score)
        .filter((score): score is number => score !== null);
      
      const averageConfidence = confidenceScores.length > 0 
        ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
        : 0;
      
      // Recent interactions (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentInteractionsCount = interactions.filter(
        i => new Date(i.created_at) > sevenDaysAgo
      ).length;

      return {
        totalInteractions,
        interactionsByType,
        averageConfidence: Math.round(averageConfidence * 100) / 100,
        recentInteractionsCount
      };
    } catch (error) {
      console.error('❌ Exception in getAIInteractionStats:', error);
      return {
        totalInteractions: 0,
        interactionsByType: {
          plant_identification: 0,
          care_advice: 0,
          disease_diagnosis: 0,
          general_chat: 0
        },
        averageConfidence: 0,
        recentInteractionsCount: 0
      };
    }
  }

  // Plant identification using AI
  static async identifyPlant(
    userId: string,
    request: PlantIdentificationRequest
  ): Promise<{ interaction: AIInteraction; response: PlantIdentificationResponse } | null> {
    try {
      console.log('🤖 Plant identification requested for user:', userId);
      
      // Initialize Gemini service if not already done
      if (!GeminiAIService.isReady()) {
        const initialized = GeminiAIService.initialize();
        if (!initialized) {
          console.error('❌ Failed to initialize Gemini AI service');
          return null;
        }
      }

      // Call Gemini AI for plant identification
      const aiResponse = await GeminiAIService.identifyPlant(request);
      
      if (!aiResponse) {
        console.error('❌ Failed to get AI response for plant identification');
        return null;
      }

      // Create a comprehensive AI response message
      const aiResponseMessage = `Identified as ${aiResponse.species} (${aiResponse.scientific_name}) with ${Math.round(aiResponse.confidence * 100)}% confidence. Family: ${aiResponse.family}. Difficulty: ${aiResponse.difficulty_level}. Care instructions: ${aiResponse.care_instructions.join(', ')}.`;

      const interaction = await this.createAIInteraction({
        user_id: userId,
        interaction_type: 'plant_identification',
        user_message: request.user_message || 'Plant identification request',
        ai_response: aiResponseMessage,
        confidence_score: aiResponse.confidence,
        image_url: request.image_url,
        metadata: aiResponse as unknown as Record<string, unknown>
      });

      if (!interaction) {
        return null;
      }

      console.log('✅ Plant identification completed successfully');
      return { interaction, response: aiResponse };
    } catch (error) {
      console.error('❌ Exception in identifyPlant:', error);
      return null;
    }
  }

  // Get care advice using AI
  static async getCareAdvice(
    userId: string,
    request: CareAdviceRequest
  ): Promise<{ interaction: AIInteraction; response: CareAdviceResponse } | null> {
    try {
      console.log('🤖 Care advice requested for user:', userId);
      
      // Initialize Gemini service if not already done
      if (!GeminiAIService.isReady()) {
        const initialized = GeminiAIService.initialize();
        if (!initialized) {
          console.error('❌ Failed to initialize Gemini AI service');
          return null;
        }
      }

      // Call Gemini AI for care advice
      const aiResponse = await GeminiAIService.getCareAdvice(request);
      
      if (!aiResponse) {
        console.error('❌ Failed to get AI response for care advice');
        return null;
      }

      // Create a comprehensive AI response message
      const aiResponseMessage = `${aiResponse.advice} Priority: ${aiResponse.priority}. Timeline: ${aiResponse.timeline}. Recommended actions: ${aiResponse.recommended_actions.join(', ')}.`;

      const interaction = await this.createAIInteraction({
        user_id: userId,
        plant_id: request.plant_id || null,
        interaction_type: 'care_advice',
        user_message: request.user_message,
        ai_response: aiResponseMessage,
        confidence_score: aiResponse.confidence,
        metadata: aiResponse as unknown as Record<string, unknown>
      });

      if (!interaction) {
        return null;
      }

      console.log('✅ Care advice completed successfully');
      return { interaction, response: aiResponse };
    } catch (error) {
      console.error('❌ Exception in getCareAdvice:', error);
      return null;
    }
  }

  // Detect plant diseases using AI
  static async detectDisease(
    userId: string,
    request: DiseaseDetectionRequest
  ): Promise<{ interaction: AIInteraction; response: DiseaseDetectionResponse } | null> {
    try {
      console.log('🤖 Disease detection requested for user:', userId);
      
      // Initialize Gemini service if not already done
      if (!GeminiAIService.isReady()) {
        const initialized = GeminiAIService.initialize();
        if (!initialized) {
          console.error('❌ Failed to initialize Gemini AI service');
          return null;
        }
      }

      // Call Gemini AI for disease detection
      const aiResponse = await GeminiAIService.detectDisease(request);
      
      if (!aiResponse) {
        console.error('❌ Failed to get AI response for disease detection');
        return null;
      }

      // Create a comprehensive AI response message
      const contagiousText = aiResponse.is_contagious ? 'Contagious - isolate plant' : 'Not contagious';
      const aiResponseMessage = `Detected: ${aiResponse.disease_name} (${aiResponse.severity} severity). ${contagiousText}. Treatment: ${aiResponse.treatment_steps.join(', ')}. Prevention: ${aiResponse.prevention_tips.join(', ')}.`;

      const interaction = await this.createAIInteraction({
        user_id: userId,
        interaction_type: 'disease_diagnosis',
        user_message: request.symptoms_description,
        ai_response: aiResponseMessage,
        confidence_score: aiResponse.confidence,
        image_url: request.image_url,
        metadata: aiResponse as unknown as Record<string, unknown>
      });

      if (!interaction) {
        return null;
      }

      console.log('✅ Disease detection completed successfully');
      return { interaction, response: aiResponse };
    } catch (error) {
      console.error('❌ Exception in detectDisease:', error);
      return null;
    }
  }

  // General chat with AI
  static async generalChat(
    userId: string,
    request: GeneralChatRequest
  ): Promise<{ interaction: AIInteraction; response: GeneralChatResponse } | null> {
    try {
      console.log('🤖 General chat requested for user:', userId);
      
      // Initialize Gemini service if not already done
      if (!GeminiAIService.isReady()) {
        const initialized = GeminiAIService.initialize();
        if (!initialized) {
          console.error('❌ Failed to initialize Gemini AI service');
          return null;
        }
      }

      // Call Gemini AI for general chat
      const aiResponse = await GeminiAIService.generalChat(request);
      
      if (!aiResponse) {
        console.error('❌ Failed to get AI response for general chat');
        return null;
      }

      // Create AI response message
      let aiResponseMessage = aiResponse.response;
      if (aiResponse.suggested_actions && aiResponse.suggested_actions.length > 0) {
        aiResponseMessage += ` Suggested actions: ${aiResponse.suggested_actions.join(', ')}.`;
      }

      const interaction = await this.createAIInteraction({
        user_id: userId,
        interaction_type: 'general_chat',
        user_message: request.message,
        ai_response: aiResponseMessage,
        confidence_score: 0.9, // General chat typically has high confidence
        metadata: aiResponse as unknown as Record<string, unknown>
      });

      if (!interaction) {
        return null;
      }

      console.log('✅ General chat completed successfully');
      return { interaction, response: aiResponse };
    } catch (error) {
      console.error('❌ Exception in generalChat:', error);
      return null;
    }
  }

  // Get recent AI interactions for dashboard
  static async getRecentAIInteractions(userId: string, limit: number = 5): Promise<AIInteraction[]> {
    try {
      if (!userId) {
        console.warn('⚠️  getRecentAIInteractions called with empty userId');
        return [];
      }

      const { data, error } = await supabase
        .from('ai_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(Math.min(limit, 20));

      if (error) {
        this.handleDatabaseError(error, 'Get recent AI interactions');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in getRecentAIInteractions:', error);
      return [];
    }
  }

  // Bulk delete AI interactions (for privacy/cleanup)
  static async bulkDeleteAIInteractions(
    userId: string, 
    interactionIds: string[]
  ): Promise<{ success: number; failed: number }> {
    try {
      if (!userId || !interactionIds.length) {
        console.warn('⚠️  bulkDeleteAIInteractions called with invalid parameters');
        return { success: 0, failed: 0 };
      }

      let success = 0;
      let failed = 0;

      // Delete in batches to avoid timeout
      const batchSize = 10;
      for (let i = 0; i < interactionIds.length; i += batchSize) {
        const batch = interactionIds.slice(i, i + batchSize);
        
        try {
          const { error } = await supabase
            .from('ai_interactions')
            .delete()
            .eq('user_id', userId)
            .in('id', batch);

          if (error) {
            this.handleDatabaseError(error, 'Bulk delete AI interactions');
            failed += batch.length;
          } else {
            success += batch.length;
          }
        } catch (batchError) {
          console.error('❌ Batch delete failed:', batchError);
          failed += batch.length;
        }
      }

      console.log(`✅ Bulk delete completed: ${success} success, ${failed} failed`);
      return { success, failed };
    } catch (error) {
      console.error('❌ Exception in bulkDeleteAIInteractions:', error);
      return { success: 0, failed: interactionIds.length };
    }
  }
}