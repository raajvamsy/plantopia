'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LeafSpinner from '@/components/ui/leaf-spinner';
import { 
  AlertTriangle, 
  Upload, 
  Shield, 
  Clock, 
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lightbulb,
  Eye
} from 'lucide-react';
import { AIService } from '@/lib/supabase/services/ai';
import { useAuth } from '@/lib/auth';
import type { 
  DiseaseDetectionRequest, 
  DiseaseDetectionResponse,
  AIInteraction
} from '@/types/api';

interface DiseaseDetectionCardProps {
  plantSpecies?: string;
  onDetectionComplete?: (result: { interaction: AIInteraction; response: DiseaseDetectionResponse }) => void;
  className?: string;
}

export function DiseaseDetectionCard({ 
  plantSpecies,
  onDetectionComplete,
  className = ''
}: DiseaseDetectionCardProps) {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [species, setSpecies] = useState(plantSpecies || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiseaseDetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDetect = async () => {
    if (!user || !symptoms.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const request: DiseaseDetectionRequest = {
        image_url: imageUrl.trim(),
        plant_species: species.trim() || undefined,
        symptoms_description: symptoms.trim(),
      };

      const response = await AIService.detectDisease(user.id, request);

      if (response) {
        setResult(response.response);
        onDetectionComplete?.(response);
      } else {
        setError('Failed to detect plant disease. Please try again.');
      }
    } catch (error) {
      console.error('Disease detection error:', error);
      setError('An error occurred during disease detection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'moderate': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'severe': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-sage-600 bg-sage-100 border-sage-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'mild': return <AlertCircle className="h-4 w-4" />;
      case 'moderate': return <AlertTriangle className="h-4 w-4" />;
      case 'severe': return <XCircle className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
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
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sage-900">Disease Detection</h3>
            <p className="text-sm text-sage-600">Analyze plant symptoms for potential diseases</p>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Plant Species (Optional)
            </label>
            <Input
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              placeholder="e.g., Monstera deliciosa, Rose, Tomato..."
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Symptoms Description *
            </label>
            <Textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe what you see: yellowing leaves, brown spots, wilting, pest damage, etc."
              disabled={isLoading}
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Image URL (Optional)
            </label>
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL for better analysis..."
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

          <Button
            onClick={handleDetect}
            disabled={!symptoms.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <LeafSpinner size="sm" className="mr-2" />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Detect Disease
              </>
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Detection Failed</h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-4">
            {/* Disease Info */}
            <div className={`p-4 border rounded-lg ${getSeverityColor(result.severity)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {getSeverityIcon(result.severity)}
                  <div>
                    <h4 className="font-semibold">{result.disease_name}</h4>
                    <p className="text-sm capitalize">Severity: {result.severity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                    {Math.round(result.confidence * 100)}% confident
                  </div>
                </div>
              </div>

              {/* Contagion Warning */}
              <div className="flex items-center gap-2 mt-3">
                {result.is_contagious ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Contagious - Isolate plant immediately
                    </span>
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Not contagious to other plants
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Treatment Steps */}
            {result.treatment_steps && result.treatment_steps.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Treatment Steps</span>
                </div>
                <div className="space-y-2">
                  {result.treatment_steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm text-blue-800">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prevention Tips */}
            {result.prevention_tips && result.prevention_tips.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">Prevention Tips</span>
                </div>
                <div className="space-y-2">
                  {result.prevention_tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-green-800">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {(result as Record<string, unknown>).expected_recovery_time && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Recovery Timeline</span>
                </div>
                <p className="text-sm text-yellow-800">{(result as Record<string, unknown>).expected_recovery_time as string}</p>
              </div>
            )}

            {/* Professional Help Warning */}
            {(result as Record<string, unknown>).professional_help_needed && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Professional Help Recommended</h4>
                    <p className="text-sm text-red-700 mt-1">
                      This condition may require professional diagnosis and treatment. Consider consulting a local plant expert or extension office.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image Preview */}
        {imageUrl && (
          <div className="mt-4">
            <img
              src={imageUrl}
              alt="Plant symptoms"
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
