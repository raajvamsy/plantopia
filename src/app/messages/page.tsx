'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { usePlantColors } from '@/lib/theme';
import { PlantopiaHeader, MobilePageWrapper, ResponsiveContainer } from '@/components/ui';
import { cn } from '@/lib/utils';

// Sample message data based on the provided design
const sampleMessages = [
  {
    id: 1,
    user: {
      name: 'Sophia Carter',
      avatar: '/api/placeholder/56/56',
      isOnline: true,
    },
    lastMessage: "Amazing! Can't wait to see your progress.",
    timestamp: '2d ago',
    unread: false,
  },
  {
    id: 2,
    user: {
      name: 'Liam Harper',
      avatar: '/api/placeholder/56/56',
      isOnline: false,
    },
    lastMessage: 'Sure, I\'ll send you some tips.',
    timestamp: '1w ago',
    unread: false,
  },
  {
    id: 3,
    user: {
      name: 'Ava Bennett',
      avatar: '/api/placeholder/56/56',
      isOnline: false,
    },
    lastMessage: 'You too! Let\'s trade cuttings sometime.',
    timestamp: '2w ago',
    unread: false,
  },
  {
    id: 4,
    user: {
      name: 'Noah Parker',
      avatar: '/api/placeholder/56/56',
      isOnline: false,
    },
    lastMessage: 'My plant is flowering!',
    timestamp: '3w ago',
    unread: false,
  },
  {
    id: 5,
    user: {
      name: 'Isabella Reed',
      avatar: '/api/placeholder/56/56',
      isOnline: true,
    },
    lastMessage: 'Just joined the app, looking forward to growing!',
    timestamp: '1m ago',
    unread: true,
  },
  {
    id: 6,
    user: {
      name: 'Jackson Hayes',
      avatar: '/api/placeholder/56/56',
      isOnline: false,
    },
    lastMessage: 'How do I earn water droplets?',
    timestamp: '2m ago',
    unread: true,
  },
];

interface MessageItemProps {
  message: typeof sampleMessages[0];
  onClick: (messageId: number) => void;
}

function MessageItem({ message, onClick }: MessageItemProps) {
  const colors = usePlantColors();

  return (
    <button
      onClick={() => onClick(message.id)}
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
          {message.user.name.charAt(0).toUpperCase()}
        </div>
        {message.user.isOnline && (
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
            message.unread ? "text-foreground" : "text-foreground"
          )}>
            {message.user.name}
          </p>
          <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">
            {message.timestamp}
          </p>
        </div>
        <p className={cn(
          "text-sm truncate",
          message.unread 
            ? "text-foreground font-medium" 
            : "text-muted-foreground"
        )}>
          {message.lastMessage}
        </p>
      </div>

      {/* Unread indicator */}
      {message.unread && (
        <div 
          className="h-3 w-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: colors.sage }}
        />
      )}
    </button>
  );
}

export default function MessagesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleMessageClick = (messageId: number) => {
    // Navigate to individual message conversation
    router.push(`/messages/${messageId}`);
  };



  const filteredMessages = sampleMessages.filter(message =>
    message.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MobilePageWrapper>
      <PlantopiaHeader 
        currentPage="community" 
        showBackButton={false}
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
                key={message.id}
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
