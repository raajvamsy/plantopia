'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LeafSpinner from '@/components/ui/leaf-spinner';
import { 
  Camera, 
  Upload, 
  Leaf, 
  Info, 
  Star, 
  BookOpen, 
  AlertCircle,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import { AIService } from '@/lib/supabase/services/ai';
import { useAuth } from '@/lib/auth';
import type { 
  PlantIdentificationRequest, 
  PlantIdentificationResponse,
  AIInteraction
} from '@/types/api';

interface PlantIdentificationCardProps {
  onIdentificationComplete?: (result: { interaction: AIInteraction; response: PlantIdentificationResponse }) => void;
  className?: string;
}

export function PlantIdentificationCard({ 
  onIdentificationComplete,
  className = ''
}: PlantIdentificationCardProps) {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlantIdentificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIdentify = async () => {
    if (!user || !imageUrl.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const request: PlantIdentificationRequest = {
        image_url: imageUrl.trim(),
        user_message: userMessage.trim() || undefined,
      };

      const response = await AIService.identifyPlant(user.id, request);

      if (response) {
        setResult(response.response);
        onIdentificationComplete?.(response);
      } else {
        setError('Failed to identify the plant. Please try again.');
      }
    } catch (error) {
      console.error('Plant identification error:', error);
      setError('An error occurred during identification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-sage-600 bg-sage-100';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sage-100 rounded-lg">
            <Leaf className="h-5 w-5 text-sage-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sage-900">Plant Identification</h3>
            <p className="text-sm text-sage-600">Upload a photo to identify your plant</p>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Image URL
            </label>
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL here..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="px-3"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Additional Information (Optional)
            </label>
            <Input
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Describe what you see or any specific questions..."
              disabled={isLoading}
            />
          </div>

          <Button
            onClick={handleIdentify}
            disabled={!imageUrl.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <LeafSpinner size="sm" className="mr-2" />
                Identifying Plant...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Identify Plant
              </>
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Identification Failed</h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-4">
            {/* Plant Info */}
            <div className="p-4 bg-sage-50 border border-sage-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-sage-900">{result.species}</h4>
                  <p className="text-sm text-sage-600 italic">{result.scientific_name}</p>
                  <p className="text-sm text-sage-600">Family: {result.family}</p>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                    {Math.round(result.confidence * 100)}% confident
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getDifficultyColor(result.difficulty_level)}`}>
                    {result.difficulty_level} care
                  </div>
                </div>
              </div>

              {/* Common Names */}
              {result.common_names && result.common_names.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-sage-600" />
                    <span className="text-sm font-medium text-sage-700">Common Names</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.common_names.map((name, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-sage-100 text-sage-700"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Care Instructions */}
            {result.care_instructions && result.care_instructions.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">Care Instructions</span>
                </div>
                <div className="space-y-2">
                  {result.care_instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-green-800">{instruction}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {(result as Record<string, unknown>).additional_notes && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Additional Notes</span>
                </div>
                <p className="text-sm text-blue-800">{(result as Record<string, unknown>).additional_notes as string}</p>
              </div>
            )}
          </div>
        )}

        {/* Image Preview */}
        {imageUrl && (
          <div className="mt-4">
            <img
              src={imageUrl}
              alt="Plant to identify"
              className="w-full h-48 object-cover rounded-lg border border-sage-200"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
