'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useSupabaseAuth } from '@/lib/auth/supabase-auth';
import { MessageService } from '@/lib/supabase/services';
import { usePlantColors } from '@/lib/theme';
import type { ConversationSummary } from '@/types/api';
import { PlantopiaHeader, MobilePageWrapper, ResponsiveContainer } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSupabaseAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Message data state
  const [messages, setMessages] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

interface MessageItemProps {
  message: ConversationSummary;
  onClick: (messageId: string) => void;
}

function MessageItem({ message, onClick }: MessageItemProps) {
  const colors = usePlantColors();

  return (
    <button
      onClick={() => onClick(message.otherUser.id)}
      className="flex items-center gap-4 w-full px-4 sm:px-6 lg:px-8 py-4 hover:bg-secondary/50 transition-colors duration-200 text-left"
    >
      {/* Avatar with online status */}
      <div className="relative flex-shrink-0">
        <div 
          className="h-14 w-14 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md"
          style={{ 
            background: `linear-gradient(135deg, ${colors.sage} 0%, ${colors.mint} 50%, ${colors.sage} 100%)`,
            boxShadow: `0 2px 8px ${colors.sage}20`
          }}
        >
          {message.otherUser.full_name.charAt(0).toUpperCase()}
        </div>
        {message.otherUser.is_online && (
          <div 
            className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background"
            style={{ backgroundColor: colors.sage }}
          />
        )}
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <p className={cn(
            "text-base font-semibold truncate",
            message.unreadCount > 0 ? "text-foreground" : "text-foreground"
          )}>
            {message.otherUser.full_name}
          </p>
          <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">
            {new Date(message.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <p className={cn(
          "text-sm truncate",
          message.unreadCount > 0
            ? "text-foreground font-medium" 
            : "text-muted-foreground"
        )}>
          {message.lastMessage.content}
        </p>
      </div>

      {/* Unread indicator */}
      {message.unreadCount > 0 && (
        <div 
          className="h-3 w-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: colors.sage }}
        />
      )}
    </button>
  );
}

  // Load messages data from Supabase
  useEffect(() => {
    if (isAuthenticated && user) {
      loadMessagesData();
    } else if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  const loadMessagesData = async () => {
    try {
      setIsLoading(true);
      const messagesData = await MessageService.getRecentConversations(user!.id);
      setMessages(messagesData);
    } catch (err) {
      console.error('Error loading messages data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageClick = (messageId: string) => {
    // Navigate to individual message conversation
    router.push(`/messages/${messageId}`);
  };

  const filteredMessages = messages.filter(message =>
    message.otherUser.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MobilePageWrapper>
      <PlantopiaHeader 
        currentPage="community" 
        customTitle="Messages"
      />
      
      <ResponsiveContainer maxWidth="4xl" padding="none" className="flex-1">
        {/* Search Bar */}
        <div className="p-4 sm:p-6 lg:p-8 border-b border-border">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              className="w-full rounded-full border-0 bg-secondary py-3 pl-10 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-background"
              placeholder="Search messages"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Messages List */}
        <div className="flex flex-col flex-1">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <MessageItem
                key={message.otherUser.id}
                message={message}
                onClick={handleMessageClick}
              />
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="text-center">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">No messages found</p>
                <p className="text-sm text-muted-foreground">
                  Try searching with different keywords
                </p>
              </div>
            </div>
          )}
        </div>
      </ResponsiveContainer>
    </MobilePageWrapper>
  );
}
