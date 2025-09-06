import { supabase } from '../config';
import type { Message, MessageInsert, ConversationSummary } from '@/types/api';

export class MessageService {
  // Get conversation between two users
  static async getConversation(userId1: string, userId2: string, limit: number = 50): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching conversation:', error);
      return [];
    }

    return data;
  }

  // Get recent conversations for a user
  static async getRecentConversations(userId: string): Promise<ConversationSummary[]> {
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
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recent conversations:', error);
      return [];
    }

    // Group by conversation and get the latest message for each
    const conversations = new Map();
    
    data.forEach(message => {
      const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
      const otherUser = message.sender_id === userId ? message.receiver : message.sender;
      
      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, {
          otherUser,
          lastMessage: message,
          unreadCount: 0
        });
      }
    });

    // Get unread count for each conversation
    for (const [otherUserId, conversation] of conversations) {
      const unreadMessages = await this.getUnreadCount(userId, otherUserId);
      conversation.unreadCount = unreadMessages;
    }

    return Array.from(conversations.values())
      .sort((a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime());
  }

  // Send a message
  static async sendMessage(messageData: Omit<MessageInsert, 'id'>): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    return data;
  }

  // Mark messages as read
  static async markMessagesAsRead(senderId: string, receiverId: string): Promise<boolean> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }

    return true;
  }

  // Get unread message count for a conversation
  static async getUnreadCount(userId: string, otherUserId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('sender_id', otherUserId)
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }

    return count || 0;
  }

  // Get total unread messages for a user
  static async getTotalUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error getting total unread count:', error);
      return 0;
    }

    return count || 0;
  }

  // Delete a message
  static async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    // Only allow sender to delete their own messages
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)
      .eq('sender_id', userId);

    if (error) {
      console.error('Error deleting message:', error);
      return false;
    }

    return true;
  }

  // Search messages by content
  static async searchMessages(userId: string, query: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .ilike('content', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error searching messages:', error);
      return [];
    }

    return data;
  }

  // Get message statistics
  static async getMessageStats(userId: string): Promise<{
    totalMessages: number;
    unreadMessages: number;
    conversationsCount: number;
  }> {
    const totalMessages = await this.getTotalMessageCount(userId);
    const unreadMessages = await this.getTotalUnreadCount(userId);
    const conversationsCount = await this.getConversationsCount(userId);

    return {
      totalMessages,
      unreadMessages,
      conversationsCount
    };
  }

  // Get total message count for a user
  private static async getTotalMessageCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error) {
      console.error('Error getting total message count:', error);
      return 0;
    }

    return count || 0;
  }

  // Get conversations count for a user
  private static async getConversationsCount(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('messages')
      .select('sender_id, receiver_id')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error) {
      console.error('Error getting conversations count:', error);
      return 0;
    }

    // Count unique users the current user has conversed with
    const uniqueUsers = new Set();
    data.forEach(message => {
      if (message.sender_id === userId) {
        uniqueUsers.add(message.receiver_id);
      } else {
        uniqueUsers.add(message.sender_id);
      }
    });

    return uniqueUsers.size;
  }
}
