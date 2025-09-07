import { supabase } from '../config';
import type { Message, MessageInsert, ConversationSummary } from '@/types/api';

export class MessageService {
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

  // Get conversation between two users with enhanced error handling
  static async getConversation(userId1: string, userId2: string, limit: number = 50): Promise<Message[]> {
    try {
      if (!userId1 || !userId2) {
        console.warn('⚠️  getConversation called with empty user IDs');
        return [];
      }

      if (userId1 === userId2) {
        console.warn('⚠️  getConversation called with same user IDs');
        return [];
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
        .order('created_at', { ascending: true })
        .limit(Math.min(limit, 200));

      if (error) {
        this.handleDatabaseError(error, 'Get conversation');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in getConversation:', error);
      return [];
    }
  }

  // Enhanced recent conversations with better error handling
  static async getRecentConversations(userId: string): Promise<ConversationSummary[]> {
    try {
      if (!userId) {
        console.warn('⚠️  getRecentConversations called with empty userId');
        return [];
      }

      // Get the latest message from each conversation
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey (
            id,
            username,
            full_name,
            avatar_url,
            is_online
          ),
          receiver:users!messages_receiver_id_fkey (
            id,
            username,
            full_name,
            avatar_url,
            is_online
          )
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(100); // Get more messages to ensure we have all conversations

      if (error) {
        this.handleDatabaseError(error, 'Get recent conversations');
        return [];
      }

      if (!data) {
        return [];
      }

      // Group by conversation and get the latest message for each
      const conversations = new Map<string, ConversationSummary>();
      
      data.forEach(message => {
        const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
        const otherUser = message.sender_id === userId ? message.receiver : message.sender;
        
        if (!otherUser) {
          console.warn('⚠️  Message missing user data:', message.id);
          return;
        }
        
        if (!conversations.has(otherUserId)) {
          conversations.set(otherUserId, {
            otherUser: {
              id: otherUser.id,
              username: otherUser.username,
              full_name: otherUser.full_name,
              avatar_url: otherUser.avatar_url,
              is_online: otherUser.is_online
            },
            lastMessage: message,
            unreadCount: 0
          });
        }
      });

      // Get unread count for each conversation
      const conversationList = Array.from(conversations.values());
      
      await Promise.all(
        conversationList.map(async (conversation) => {
          try {
            const unreadCount = await this.getUnreadCount(userId, conversation.otherUser.id);
            conversation.unreadCount = unreadCount;
          } catch (error) {
            console.warn('⚠️  Failed to get unread count for conversation:', error);
            conversation.unreadCount = 0;
          }
        })
      );

      return conversationList.sort((a, b) => 
        new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
      );
    } catch (error) {
      console.error('❌ Exception in getRecentConversations:', error);
      return [];
    }
  }

  // Enhanced message sending with validation
  static async sendMessage(messageData: Omit<MessageInsert, 'id'>): Promise<Message | null> {
    try {
      // Validate required fields
      if (!messageData.sender_id || !messageData.receiver_id || !messageData.content) {
        console.error('❌ sendMessage called with missing required fields:', messageData);
        return null;
      }

      if (messageData.sender_id === messageData.receiver_id) {
        console.error('❌ Cannot send message to self');
        return null;
      }

      // Normalize message content
      const normalizedData = {
        ...messageData,
        content: messageData.content.trim(),
      };

      if (normalizedData.content.length === 0) {
        console.error('❌ Cannot send empty message');
        return null;
      }

      if (normalizedData.content.length > 1000) {
        console.error('❌ Message too long (max 1000 characters)');
        return null;
      }

      const { data, error } = await supabase
        .from('messages')
        .insert(normalizedData)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Send message');
        return null;
      }

      console.log('✅ Message sent successfully');
      return data;
    } catch (error) {
      console.error('❌ Exception in sendMessage:', error);
      return null;
    }
  }

  // Enhanced mark messages as read with validation
  static async markMessagesAsRead(senderId: string, receiverId: string): Promise<boolean> {
    try {
      if (!senderId || !receiverId) {
        console.warn('⚠️  markMessagesAsRead called with empty IDs');
        return false;
      }

      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', senderId)
        .eq('receiver_id', receiverId)
        .eq('is_read', false);

      if (error) {
        this.handleDatabaseError(error, 'Mark messages as read');
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Exception in markMessagesAsRead:', error);
      return false;
    }
  }

  // Enhanced unread count with error handling
  static async getUnreadCount(userId: string, otherUserId: string): Promise<number> {
    try {
      if (!userId || !otherUserId) {
        console.warn('⚠️  getUnreadCount called with empty IDs');
        return 0;
      }

      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', otherUserId)
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) {
        this.handleDatabaseError(error, 'Get unread count');
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('❌ Exception in getUnreadCount:', error);
      return 0;
    }
  }

  // Enhanced total unread count
  static async getTotalUnreadCount(userId: string): Promise<number> {
    try {
      if (!userId) {
        console.warn('⚠️  getTotalUnreadCount called with empty userId');
        return 0;
      }

      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) {
        this.handleDatabaseError(error, 'Get total unread count');
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('❌ Exception in getTotalUnreadCount:', error);
      return 0;
    }
  }

  // Enhanced message deletion with proper authorization
  static async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    try {
      if (!messageId || !userId) {
        console.warn('⚠️  deleteMessage called with empty parameters');
        return false;
      }

      // Only allow sender to delete their own messages
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', userId);

      if (error) {
        this.handleDatabaseError(error, 'Delete message');
        return false;
      }

      console.log('✅ Message deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception in deleteMessage:', error);
      return false;
    }
  }

  // Enhanced message search with better filtering
  static async searchMessages(userId: string, query: string, limit: number = 20): Promise<Message[]> {
    try {
      if (!userId || !query || query.trim().length === 0) {
        console.warn('⚠️  searchMessages called with invalid parameters');
        return [];
      }

      const normalizedQuery = query.trim();
      
      if (normalizedQuery.length < 2) {
        console.warn('⚠️  Search query too short (minimum 2 characters)');
        return [];
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .ilike('content', `%${normalizedQuery}%`)
        .order('created_at', { ascending: false })
        .limit(Math.min(limit, 50));

      if (error) {
        this.handleDatabaseError(error, 'Search messages');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exception in searchMessages:', error);
      return [];
    }
  }

  // Enhanced message statistics
  static async getMessageStats(userId: string): Promise<{
    totalMessages: number;
    unreadMessages: number;
    conversationsCount: number;
    messagesSentToday: number;
    messagesReceivedToday: number;
  }> {
    try {
      if (!userId) {
        console.warn('⚠️  getMessageStats called with empty userId');
        return {
          totalMessages: 0,
          unreadMessages: 0,
          conversationsCount: 0,
          messagesSentToday: 0,
          messagesReceivedToday: 0
        };
      }

      const [
        totalMessages,
        unreadMessages,
        conversationsCount,
        todayStats
      ] = await Promise.all([
        this.getTotalMessageCount(userId),
        this.getTotalUnreadCount(userId),
        this.getConversationsCount(userId),
        this.getTodayMessageStats(userId)
      ]);

      return {
        totalMessages,
        unreadMessages,
        conversationsCount,
        messagesSentToday: todayStats.sent,
        messagesReceivedToday: todayStats.received
      };
    } catch (error) {
      console.error('❌ Exception in getMessageStats:', error);
      return {
        totalMessages: 0,
        unreadMessages: 0,
        conversationsCount: 0,
        messagesSentToday: 0,
        messagesReceivedToday: 0
      };
    }
  }

  // Enhanced total message count
  private static async getTotalMessageCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

      if (error) {
        this.handleDatabaseError(error, 'Get total message count');
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('❌ Exception in getTotalMessageCount:', error);
      return 0;
    }
  }

  // Enhanced conversations count
  private static async getConversationsCount(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

      if (error) {
        this.handleDatabaseError(error, 'Get conversations count');
        return 0;
      }

      if (!data) {
        return 0;
      }

      // Count unique users the current user has conversed with
      const uniqueUsers = new Set<string>();
      data.forEach(message => {
        if (message.sender_id === userId) {
          uniqueUsers.add(message.receiver_id);
        } else {
          uniqueUsers.add(message.sender_id);
        }
      });

      return uniqueUsers.size;
    } catch (error) {
      console.error('❌ Exception in getConversationsCount:', error);
      return 0;
    }
  }

  // Get today's message statistics
  private static async getTodayMessageStats(userId: string): Promise<{ sent: number; received: number }> {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

      const [sentResult, receivedResult] = await Promise.all([
        supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', userId)
          .gte('created_at', startOfDay)
          .lt('created_at', endOfDay),
        supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', userId)
          .gte('created_at', startOfDay)
          .lt('created_at', endOfDay)
      ]);

      return {
        sent: sentResult.count || 0,
        received: receivedResult.count || 0
      };
    } catch (error) {
      console.error('❌ Exception in getTodayMessageStats:', error);
      return { sent: 0, received: 0 };
    }
  }

  // Update message (for editing)
  static async updateMessage(
    messageId: string, 
    userId: string, 
    newContent: string
  ): Promise<Message | null> {
    try {
      if (!messageId || !userId || !newContent) {
        console.warn('⚠️  updateMessage called with invalid parameters');
        return null;
      }

      const trimmedContent = newContent.trim();
      
      if (trimmedContent.length === 0) {
        console.error('❌ Cannot update message with empty content');
        return null;
      }

      if (trimmedContent.length > 1000) {
        console.error('❌ Updated message too long (max 1000 characters)');
        return null;
      }

      // Only allow sender to update their own messages
      const { data, error } = await supabase
        .from('messages')
        .update({ 
          content: trimmedContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('sender_id', userId)
        .select()
        .single();

      if (error) {
        this.handleDatabaseError(error, 'Update message');
        return null;
      }

      console.log('✅ Message updated successfully');
      return data;
    } catch (error) {
      console.error('❌ Exception in updateMessage:', error);
      return null;
    }
  }

  // Bulk delete messages (for conversation cleanup)
  static async bulkDeleteMessages(
    userId: string, 
    messageIds: string[]
  ): Promise<{ success: number; failed: number }> {
    try {
      if (!userId || !messageIds.length) {
        console.warn('⚠️  bulkDeleteMessages called with invalid parameters');
        return { success: 0, failed: 0 };
      }

      let success = 0;
      let failed = 0;

      // Delete in batches to avoid timeout
      const batchSize = 10;
      for (let i = 0; i < messageIds.length; i += batchSize) {
        const batch = messageIds.slice(i, i + batchSize);
        
        try {
          const { error } = await supabase
            .from('messages')
            .delete()
            .eq('sender_id', userId) // Only delete messages sent by the user
            .in('id', batch);

          if (error) {
            this.handleDatabaseError(error, 'Bulk delete messages');
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
      console.error('❌ Exception in bulkDeleteMessages:', error);
      return { success: 0, failed: messageIds.length };
    }
  }
}