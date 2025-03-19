
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Message, Conversation } from '@/lib/supabase';

export const useChat = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    // Fetch user's conversations
    const fetchConversations = async () => {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id])
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching conversations:', error);
        toast.error('Failed to load conversations');
      } else {
        setConversations(data as Conversation[]);
      }
      
      setIsLoading(false);
    };
    
    fetchConversations();
    
    // Subscribe to new conversations
    const conversationSubscription = supabase
      .channel('public:conversations')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'conversations',
          filter: `participants=cs.{${user.id}}` 
        }, 
        (payload) => {
          console.log('Conversation change received:', payload);
          fetchConversations();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(conversationSubscription);
    };
  }, [user]);

  // Fetch and subscribe to messages for a specific conversation
  useEffect(() => {
    if (!conversationId || !user) return;
    
    setIsLoading(true);
    
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } else {
        setMessages(data as Message[]);
      }
      
      setIsLoading(false);
    };
    
    fetchMessages();
    
    // Mark messages as seen
    const markMessagesAsSeen = async () => {
      await supabase
        .from('messages')
        .update({ seen: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('seen', false);
    };
    
    markMessagesAsSeen();
    
    // Subscribe to new messages
    const messageSubscription = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}` 
        }, 
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          
          // Mark received messages as seen
          if (newMessage.sender_id !== user.id) {
            supabase
              .from('messages')
              .update({ seen: true })
              .eq('id', newMessage.id);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [conversationId, user]);

  const sendMessage = async (content: string, imageFile?: File) => {
    if (!user || !conversationId || (!content.trim() && !imageFile)) return;
    
    setIsSending(true);
    
    try {
      let imageUrl = undefined;
      
      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('chat_images')
          .upload(filePath, imageFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from('chat_images')
          .getPublicUrl(filePath);
          
        imageUrl = data.publicUrl;
      }
      
      // Send message
      const newMessage = {
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
        image_url: imageUrl,
        seen: false,
      };
      
      const { error } = await supabase
        .from('messages')
        .insert(newMessage);
        
      if (error) throw error;
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const createConversation = async (participantIds: string[]) => {
    if (!user) return null;
    
    try {
      // Ensure current user is included in participants
      const allParticipants = [...new Set([...participantIds, user.id])];
      
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participants: allParticipants,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data as Conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to create conversation');
      return null;
    }
  };

  return {
    messages,
    conversations,
    isLoading,
    isSending,
    sendMessage,
    createConversation,
  };
};
