'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Send } from 'lucide-react';
import { usePlantColors } from '@/lib/theme';
import { PlantopiaHeader, MobilePageWrapper, ResponsiveContainer } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  text: string;
  timestamp: string;
  sender: 'me' | 'other';
}

interface Conversation {
  user: { name: string; avatar: string };
  messages: Message[];
}

// Sample message conversation data
const sampleConversations: { [key: string]: Conversation } = {
  '1': {
    user: { name: 'Sophia Carter', avatar: '/api/placeholder/56/56' },
    messages: [
      { id: 1, text: 'Hey! I saw your post about the monstera. It looks amazing!', timestamp: '10:30 AM', sender: 'other' },
      { id: 2, text: 'Thank you! It took a while to get the care routine right.', timestamp: '10:35 AM', sender: 'me' },
      { id: 3, text: 'I\'m having trouble with mine. Any tips?', timestamp: '10:36 AM', sender: 'other' },
      { id: 4, text: 'Sure! The key is bright indirect light and letting the soil dry between waterings.', timestamp: '10:40 AM', sender: 'me' },
      { id: 5, text: 'Amazing! Can\'t wait to see your progress.', timestamp: '10:42 AM', sender: 'other' },
    ]
  },
  '5': {
    user: { name: 'Isabella Reed', avatar: '/api/placeholder/56/56' },
    messages: [
      { id: 1, text: 'Hi! I just joined the app and I\'m so excited!', timestamp: '2:15 PM', sender: 'other' },
      { id: 2, text: 'Welcome to Plantopia! What plants are you growing?', timestamp: '2:20 PM', sender: 'me' },
      { id: 3, text: 'Just joined the app, looking forward to growing!', timestamp: '2:22 PM', sender: 'other' },
    ]
  }
};

export default function MessageConversationPage() {
  const params = useParams();
  const colors = usePlantColors();
  const [newMessage, setNewMessage] = useState('');
  
  const messageId = params.id as string;
  const conversation = sampleConversations[messageId] || {
    user: { name: 'Unknown User', avatar: '/api/placeholder/56/56' },
    messages: []
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <MobilePageWrapper>
      <PlantopiaHeader 
        currentPage="community" 
        customTitle={conversation.user.name}
      />
      
      {/* Messages Container - with bottom padding for fixed input */}
      <div className="flex-1 overflow-y-auto pb-20">
        <ResponsiveContainer maxWidth="4xl" padding="md" className="py-4">
          <div className="space-y-4">
            {conversation.messages.map((message: Message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === 'me' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-xs sm:max-w-md px-4 py-3 rounded-2xl",
                    message.sender === 'me'
                      ? "text-white rounded-br-md"
                      : "bg-secondary text-foreground rounded-bl-md"
                  )}
                  style={{
                    backgroundColor: message.sender === 'me' ? colors.sage : undefined
                  }}
                >
                  <p className="text-sm">{message.text}</p>
                  <p 
                    className={cn(
                      "text-xs mt-1",
                      message.sender === 'me' 
                        ? "text-white/70" 
                        : "text-muted-foreground"
                    )}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ResponsiveContainer>
      </div>

      {/* Fixed Message Input at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm p-4 safe-area-pb">
        <ResponsiveContainer maxWidth="4xl" padding="none">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full resize-none rounded-2xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
                rows={1}
                style={{ 
                  minHeight: '48px', 
                  maxHeight: '120px',
                  lineHeight: '1.5'
                }}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="icon"
              className={cn(
                "h-12 w-12 rounded-2xl text-white transition-all flex-shrink-0",
                newMessage.trim() 
                  ? "opacity-100 scale-100 shadow-lg" 
                  : "opacity-50 scale-95"
              )}
              style={{ backgroundColor: colors.sage }}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </ResponsiveContainer>
      </div>
    </MobilePageWrapper>
  );
}