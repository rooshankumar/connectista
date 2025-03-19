
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Image as ImageIcon, 
  Send, 
  Smile,
  X
} from 'lucide-react';
import { useChat } from '@/hooks/useChat';

type ChatInputProps = {
  conversationId: string;
};

export function ChatInput({ conversationId }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isSending } = useChat(conversationId);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (isSending || (!message.trim() && !selectedImage)) return;
    
    await sendMessage(message, selectedImage || undefined);
    setMessage('');
    clearImage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t p-4 bg-background">
      {imagePreview && (
        <div className="relative mb-2 inline-block">
          <div className="relative h-24 w-24 rounded-md overflow-hidden border">
            <img 
              src={imagePreview} 
              alt="Selected" 
              className="h-full w-full object-cover"
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-0 right-0 h-6 w-6 rounded-full"
              onClick={clearImage}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="flex-1 overflow-hidden rounded-md border bg-background">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="resize-none border-0 p-3 h-12 max-h-32 bg-transparent"
            disabled={isSending}
          />
        </div>
        
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
            disabled={isSending}
          />
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
            className="h-10 w-10 rounded-full"
          >
            <ImageIcon className="h-5 w-5" />
            <span className="sr-only">Attach image</span>
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            disabled={isSending}
            className="h-10 w-10 rounded-full"
          >
            <Smile className="h-5 w-5" />
            <span className="sr-only">Add emoji</span>
          </Button>
          
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={isSending || (!message.trim() && !selectedImage)}
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
