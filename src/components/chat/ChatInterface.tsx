
import { useEffect, useRef } from 'react';
import { ChatInput } from '@/components/chat/ChatInput';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { useChat } from '@/hooks/useChat';
import { MessageCircle } from 'lucide-react';

type ChatInterfaceProps = {
  conversationId: string;
};

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const { messages, isLoading } = useChat(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-13rem)] items-center justify-center">
        <div className="text-center animate-pulse-soft">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Loading messages...</h3>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-[calc(100vh-13rem)]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">No messages yet</h3>
            <p className="text-muted-foreground">Start the conversation by sending a message below.</p>
          </div>
        </div>
        <ChatInput conversationId={conversationId} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-13rem)]">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <ChatInput conversationId={conversationId} />
    </div>
  );
}
