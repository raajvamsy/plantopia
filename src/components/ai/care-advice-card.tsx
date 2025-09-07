'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LeafSpinner from '@/components/ui/leaf-spinner';
import { 
  Lightbulb, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  Info,
  Star,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';
import { AIService } from '@/lib/supabase/services/ai';
import { useAuth } from '@/lib/auth';
import type { 
  CareAdviceRequest, 
  CareAdviceResponse,
  AIInteraction
} from '@/types/api';

interface CareAdviceCardProps {
  plantId?: string;
  plantSpecies?: string;
  onAdviceComplete?: (result: { interaction: AIInteraction; response: CareAdviceResponse }) => void;
  className?: string;
}

export function CareAdviceCard({ 
  plantId,
  plantSpecies,
  onAdviceComplete,
  className = ''
}: CareAdviceCardProps) {
  const { user } = useAuth();
  const [species, setSpecies] = useState(plantSpecies || '');
  const [message, setMessage] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CareAdviceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetAdvice = async () => {
    if (!user || !message.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const request: CareAdviceRequest = {
        plant_id: plantId,
        plant_species: species.trim() || undefined,
        symptoms: symptoms.length > 0 ? symptoms : undefined,
        user_message: message.trim(),
      };

      const response = await AIService.getCareAdvice(user.id, request);

      if (response) {
        setResult(response.response);
        onAdviceComplete?.(response);
      } else {
        setError('Failed to get care advice. Please try again.');
      }
    } catch (error) {
      console.error('Care advice error:', error);
      setError('An error occurred while getting care advice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addSymptom = () => {
    if (newSymptom.trim() && !symptoms.includes(newSymptom.trim())) {
      setSymptoms([...symptoms, newSymptom.trim()]);
      setNewSymptom('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'urgent': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-sage-600 bg-sage-100 border-sage-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'low': return <Info className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'urgent': return <Target className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
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
          <div className="p-2 bg-blue-100 rounded-lg">
            <Lightbulb className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sage-900">Care Advice</h3>
            <p className="text-sm text-sage-600">Get personalized plant care recommendations</p>
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
              placeholder="e.g., Monstera deliciosa, Peace Lily, Snake Plant..."
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Symptoms or Concerns (Optional)
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  placeholder="e.g., yellowing leaves, drooping, brown spots..."
                  disabled={isLoading}
                  onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
                  className="flex-1"
                />
                <Button
                  onClick={addSymptom}
                  variant="outline"
                  size="sm"
                  disabled={!newSymptom.trim() || isLoading}
                >
                  Add
                </Button>
              </div>
              
              {symptoms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-sage-100 text-sage-700 rounded-md text-sm"
                    >
                      {symptom}
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className="text-sage-500 hover:text-sage-700"
                        disabled={isLoading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Your Question or Concern *
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your plant care question or concern in detail..."
              disabled={isLoading}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleGetAdvice}
            disabled={!message.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <LeafSpinner size="sm" className="mr-2" />
                Getting Advice...
              </>
            ) : (
              <>
                <Lightbulb className="h-4 w-4 mr-2" />
                Get Care Advice
              </>
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Failed to Get Advice</h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-4">
            {/* Main Advice */}
            <div className="p-4 bg-sage-50 border border-sage-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-sage-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sage-900">Care Recommendation</h4>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                    {Math.round(result.confidence * 100)}% confident
                  </div>
                </div>
              </div>
              <p className="text-sage-800 leading-relaxed">{result.advice}</p>
            </div>

            {/* Priority Level */}
            <div className={`p-4 border rounded-lg ${getPriorityColor(result.priority)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getPriorityIcon(result.priority)}
                <span className="font-medium capitalize">Priority: {result.priority}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Timeline: {result.timeline}</span>
              </div>
            </div>

            {/* Recommended Actions */}
            {result.recommended_actions && result.recommended_actions.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Recommended Actions</span>
                </div>
                <div className="space-y-2">
                  {result.recommended_actions.map((action, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm text-blue-800">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Fields from Extended Response */}
            {result.preventive_measures && result.preventive_measures.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">Preventive Measures</span>
                </div>
                <div className="space-y-2">
                  {result.preventive_measures.map((measure, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-green-800">{measure}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.warning_signs && result.warning_signs.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Warning Signs to Watch For</span>
                </div>
                <div className="space-y-2">
                  {result.warning_signs.map((sign, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-yellow-800">{sign}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
