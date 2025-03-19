
import { useState, useEffect } from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import type { Message } from '@/lib/supabase';

type MessageBubbleProps = {
  message: Message;
  showTranslation?: boolean;
};

export function MessageBubble({ message, showTranslation = false }: MessageBubbleProps) {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const isCurrentUser = message.sender_id === user?.id;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };
  
  return (
    <div 
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 transform transition-all duration-300 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className={`max-w-[80%] ${isCurrentUser ? 'ml-12' : 'mr-12'}`}>
        <div className={isCurrentUser ? 'message-bubble-sent' : 'message-bubble-received'}>
          <div className="flex flex-col">
            {message.content && (
              <p className="text-sm">{message.content}</p>
            )}
            
            {message.is_translated && showTranslation && message.original_content && (
              <div className="mt-2 text-xs italic opacity-75">
                <p>Original: {message.original_content}</p>
              </div>
            )}
            
            {message.image_url && (
              <div className="mt-2 overflow-hidden rounded-lg">
                <img 
                  src={message.image_url} 
                  alt="Message attachment" 
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className={`flex items-center text-xs mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'} text-muted-foreground`}>
          <span>{formatTime(message.created_at)}</span>
          
          {isCurrentUser && (
            <span className="ml-1">
              {message.seen ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
