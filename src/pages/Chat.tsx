
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  MessageSquare, 
  UserPlus, 
  UserX,
  ChevronLeft
} from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

const Chat = () => {
  const { conversationId } = useParams();
  const { conversations, isLoading, createConversation } = useChat();
  const [selectedId, setSelectedId] = useState<string | undefined>(conversationId);
  const [isMobileListOpen, setIsMobileListOpen] = useState(!conversationId);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    if (conversationId) {
      setSelectedId(conversationId);
      if (isMobile) {
        setIsMobileListOpen(false);
      }
    }
  }, [conversationId, isMobile]);

  const handleCreateNewChat = async () => {
    // For demo, we'll create a conversation with a dummy user ID
    // In a real app, you'd select users from a list
    const newConversation = await createConversation(['dummy-user-id']);
    if (newConversation) {
      navigate(`/chat/${newConversation.id}`);
    }
  };

  const handleSelectConversation = (id: string) => {
    navigate(`/chat/${id}`);
  };

  const toggleMobileList = () => {
    setIsMobileListOpen(!isMobileListOpen);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Mock conversation data for UI demo
  const mockConversations = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: null,
      lastMessage: 'How do you say "thank you" in Spanish?',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: '2',
      name: 'Miguel Rodriguez',
      avatar: null,
      lastMessage: 'I\'m practicing my English every day',
      time: 'Yesterday',
      unread: false,
    },
    {
      id: '3',
      name: 'Julia Schmidt',
      avatar: null,
      lastMessage: 'Let\'s practice speaking tomorrow!',
      time: '3 days ago',
      unread: false,
    },
  ];

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-xl border animate-fade-in">
        {/* Conversation List - hidden on mobile when viewing a conversation */}
        <div 
          className={`w-full md:w-80 border-r bg-card ${
            isMobile && !isMobileListOpen ? 'hidden' : 'flex flex-col'
          }`}
        >
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          
          <div className="p-4">
            <Button 
              className="w-full flex items-center gap-2"
              onClick={handleCreateNewChat}
            >
              <PlusCircle className="h-4 w-4" />
              New Conversation
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {isLoading ? (
                <div className="py-4 text-center text-muted-foreground">
                  Loading conversations...
                </div>
              ) : mockConversations.length > 0 ? (
                mockConversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedId === conversation.id 
                        ? 'bg-accent' 
                        : 'hover:bg-accent/50'
                    } ${conversation.unread ? 'font-medium' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatar || undefined} />
                        <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="truncate font-medium">{conversation.name}</p>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <p className="text-sm truncate text-muted-foreground">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  No conversations yet
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Interface or Empty State */}
        {isMobile && isMobileListOpen ? (
          null
        ) : selectedId ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="flex items-center p-4 h-16 border-b bg-card">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={toggleMobileList}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Back</span>
                </Button>
              )}
              
              <div className="flex items-center flex-1 min-w-0">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">Sarah Chen</h3>
                  <p className="text-xs text-muted-foreground truncate">Native: Chinese • Learning: English, Spanish</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <UserPlus className="h-5 w-5" />
                  <span className="sr-only">Add user</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5" />
                  <span className="sr-only">Message info</span>
                </Button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <ChatInterface conversationId={selectedId} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 bg-card">
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
                <p className="text-muted-foreground mb-6">
                  Choose an existing conversation or start a new one
                </p>
                <Button 
                  className="w-full"
                  onClick={handleCreateNewChat}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Start New Conversation
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Chat;
