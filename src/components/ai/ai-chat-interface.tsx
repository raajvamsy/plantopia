'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import LeafSpinner from '@/components/ui/leaf-spinner';
import { UserAvatar } from '@/components/common/user-avatar';
import { Send, Bot, User, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import { AIService } from '@/lib/supabase/services/ai';
import { useAuth } from '@/lib/auth';
import type { 
  AIInteraction, 
  GeneralChatRequest, 
  GeneralChatResponse,
  Plant,
  Task
} from '@/types/api';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  confidence?: number;
}

interface AIChatInterfaceProps {
  userPlants?: Plant[];
  recentTasks?: Task[];
  onNewInteraction?: (interaction: AIInteraction) => void;
  className?: string;
}

export function AIChatInterface({ 
  userPlants = [], 
  recentTasks = [],
  onNewInteraction,
  className = ''
}: AIChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      type: 'ai',
      content: "Hi! I'm your plant care assistant. Ask me anything about plant care, identification, or troubleshooting!",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const request: GeneralChatRequest = {
        message: inputValue.trim(),
        context: {
          user_plants: userPlants,
          recent_tasks: recentTasks,
        }
      };

      const result = await AIService.generalChat(user.id, request);

      if (result) {
        const aiMessage: ChatMessage = {
          id: result.interaction.id,
          type: 'ai',
          content: result.response.response,
          timestamp: new Date(result.interaction.created_at),
          metadata: result.response as unknown as Record<string, unknown>,
          confidence: result.interaction.confidence_score || undefined,
        };

        setMessages(prev => [...prev, aiMessage]);
        onNewInteraction?.(result.interaction);
      } else {
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'ai',
          content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: "I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderSuggestedActions = (actions: string[]): React.ReactNode => {
    if (!actions || actions.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-sm text-sage-600">
          <Lightbulb className="h-4 w-4" />
          <span>Suggested actions:</span>
        </div>
        <div className="space-y-1">
          {actions.map((action, index) => (
            <div key={index} className="flex items-start gap-2 text-sm text-sage-700">
              <CheckCircle className="h-3 w-3 mt-0.5 text-sage-500 flex-shrink-0" />
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderConfidenceIndicator = (confidence?: number) => {
    if (!confidence) return null;

    const percentage = Math.round(confidence * 100);
    const color = confidence >= 0.8 ? 'text-green-600' : confidence >= 0.6 ? 'text-yellow-600' : 'text-red-600';

    return (
      <div className={`text-xs ${color} mt-1`}>
        Confidence: {percentage}%
      </div>
    );
  };

  return (
    <Card className={`flex flex-col h-96 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-sage-200 bg-sage-50">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-sage-600" />
          <h3 className="font-medium text-sage-900">Plant Care Assistant</h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'ai' && (
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-sage-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-sage-600" />
                </div>
              </div>
            )}
            
            <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-1' : ''}`}>
              <div
                className={`rounded-lg px-3 py-2 ${
                  message.type === 'user'
                    ? 'bg-sage-600 text-white'
                    : 'bg-sage-100 text-sage-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {renderConfidenceIndicator(message.confidence)}
              </div>
              
              {message.type === 'ai' && message.metadata?.suggested_actions ? 
                renderSuggestedActions(message.metadata.suggested_actions as string[]) : null
              }
              
              <div className="text-xs text-sage-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {message.type === 'user' && user && (
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-sage-600 text-white flex items-center justify-center text-sm font-medium">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-sage-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-sage-600" />
              </div>
            </div>
            <div className="bg-sage-100 rounded-lg px-3 py-2">
              <LeafSpinner size="sm" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-sage-200">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about plant care, identification, or problems..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
