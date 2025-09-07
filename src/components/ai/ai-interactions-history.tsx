'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LeafSpinner from '@/components/ui/leaf-spinner';
import { 
  History, 
  Search, 
  Bot, 
  Leaf, 
  AlertTriangle, 
  MessageCircle,
  Calendar,
  Star,
  Filter,
  Trash2,
  Eye,
  MoreVertical
} from 'lucide-react';
import { AIService } from '@/lib/supabase/services/ai';
import { useAuth } from '@/lib/auth';
import type { 
  AIInteraction, 
  AIInteractionType
} from '@/types/api';

interface AIInteractionsHistoryProps {
  limit?: number;
  showSearch?: boolean;
  showFilters?: boolean;
  onInteractionSelect?: (interaction: AIInteraction) => void;
  className?: string;
}

export function AIInteractionsHistory({ 
  limit = 20,
  showSearch = true,
  showFilters = true,
  onInteractionSelect,
  className = ''
}: AIInteractionsHistoryProps) {
  const { user } = useAuth();
  const [interactions, setInteractions] = useState<AIInteraction[]>([]);
  const [filteredInteractions, setFilteredInteractions] = useState<AIInteraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<AIInteractionType | 'all'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadInteractions();
    }
  }, [user]);

  useEffect(() => {
    filterInteractions();
  }, [interactions, searchQuery, selectedType]);

  const loadInteractions = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await AIService.getUserAIInteractions(
        user.id, 
        selectedType === 'all' ? undefined : selectedType,
        limit
      );
      setInteractions(data);
    } catch (error) {
      console.error('Error loading AI interactions:', error);
      setError('Failed to load AI interactions');
    } finally {
      setIsLoading(false);
    }
  };

  const filterInteractions = () => {
    let filtered = [...interactions];

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(interaction => interaction.interaction_type === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(interaction =>
        interaction.user_message.toLowerCase().includes(query) ||
        interaction.ai_response.toLowerCase().includes(query)
      );
    }

    setFilteredInteractions(filtered);
  };

  const handleDeleteInteraction = async (interactionId: string) => {
    if (!user) return;

    try {
      const success = await AIService.deleteAIInteraction(interactionId, user.id);
      if (success) {
        setInteractions(prev => prev.filter(i => i.id !== interactionId));
      }
    } catch (error) {
      console.error('Error deleting interaction:', error);
    }
  };

  const getInteractionIcon = (type: AIInteractionType) => {
    switch (type) {
      case 'plant_identification': return <Leaf className="h-4 w-4" />;
      case 'care_advice': return <Bot className="h-4 w-4" />;
      case 'disease_diagnosis': return <AlertTriangle className="h-4 w-4" />;
      case 'general_chat': return <MessageCircle className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getInteractionColor = (type: AIInteractionType) => {
    switch (type) {
      case 'plant_identification': return 'text-green-600 bg-green-100';
      case 'care_advice': return 'text-blue-600 bg-blue-100';
      case 'disease_diagnosis': return 'text-red-600 bg-red-100';
      case 'general_chat': return 'text-purple-600 bg-purple-100';
      default: return 'text-sage-600 bg-sage-100';
    }
  };

  const getInteractionLabel = (type: AIInteractionType) => {
    switch (type) {
      case 'plant_identification': return 'Plant ID';
      case 'care_advice': return 'Care Advice';
      case 'disease_diagnosis': return 'Disease Check';
      case 'general_chat': return 'Chat';
      default: return 'AI';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sage-100 rounded-lg">
              <History className="h-5 w-5 text-sage-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sage-900">AI Interactions</h3>
              <p className="text-sm text-sage-600">Your conversation history</p>
            </div>
          </div>
          <Button
            onClick={loadInteractions}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? <LeafSpinner size="sm" /> : 'Refresh'}
          </Button>
        </div>

        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="space-y-3">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search interactions..."
                  className="pl-10"
                />
              </div>
            )}

            {showFilters && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => setSelectedType('all')}
                  variant={selectedType === 'all' ? 'default' : 'outline'}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  onClick={() => setSelectedType('plant_identification')}
                  variant={selectedType === 'plant_identification' ? 'default' : 'outline'}
                  size="sm"
                >
                  Plant ID
                </Button>
                <Button
                  onClick={() => setSelectedType('care_advice')}
                  variant={selectedType === 'care_advice' ? 'default' : 'outline'}
                  size="sm"
                >
                  Care Advice
                </Button>
                <Button
                  onClick={() => setSelectedType('disease_diagnosis')}
                  variant={selectedType === 'disease_diagnosis' ? 'default' : 'outline'}
                  size="sm"
                >
                  Disease Check
                </Button>
                <Button
                  onClick={() => setSelectedType('general_chat')}
                  variant={selectedType === 'general_chat' ? 'default' : 'outline'}
                  size="sm"
                >
                  Chat
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Interactions List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LeafSpinner size="md" />
            </div>
          ) : filteredInteractions.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-sage-300 mx-auto mb-3" />
              <p className="text-sage-500">
                {searchQuery || selectedType !== 'all' 
                  ? 'No interactions match your filters' 
                  : 'No AI interactions yet'
                }
              </p>
            </div>
          ) : (
            filteredInteractions.map((interaction) => (
              <div
                key={interaction.id}
                className="p-4 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors cursor-pointer"
                onClick={() => onInteractionSelect?.(interaction)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${getInteractionColor(interaction.interaction_type)}`}>
                      {getInteractionIcon(interaction.interaction_type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-sage-900">
                          {getInteractionLabel(interaction.interaction_type)}
                        </span>
                        {interaction.confidence_score && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs text-sage-600">
                              {Math.round(interaction.confidence_score * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-sage-700 mb-2">
                        {truncateText(interaction.user_message)}
                      </p>
                      
                      <p className="text-sm text-sage-600">
                        {truncateText(interaction.ai_response)}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-sage-500">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(interaction.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInteractionSelect?.(interaction);
                      }}
                      variant="ghost"
                      size="sm"
                      className="p-1"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteInteraction(interaction.id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredInteractions.length === limit && (
          <div className="text-center">
            <Button
              onClick={() => loadInteractions()}
              variant="outline"
              size="sm"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
