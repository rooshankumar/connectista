
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Languages, MessageCircle, Users } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while still loading auth state
    if (isLoading) return;

    if (isAuthenticated) {
      // If authenticated but not onboarded, redirect to onboarding
      if (profile && !profile.onboarding_completed) {
        navigate('/onboarding');
      } else {
        // If authenticated and onboarded, redirect to dashboard
        navigate('/dashboard');
      }
    }
    // If not authenticated, stay on landing page
  }, [isAuthenticated, isLoading, navigate, profile]);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">roshLingua</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Log in
          </Button>
          <Button onClick={() => navigate('/signup')}>Sign up</Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
          Connect & Learn Languages
          <br />
          <span className="text-primary">Together</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mb-10 animate-fade-in">
          Practice languages with native speakers around the world. 
          Real conversations, real progress, real connections.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" onClick={handleGetStarted} className="animate-fade-in">
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="animate-fade-in">
            I already have an account
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
          Learn languages the natural way
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real Conversations</h3>
            <p className="text-muted-foreground">
              Chat with native speakers in real-time to improve your language skills naturally.
            </p>
          </div>
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Find Language Partners</h3>
            <p className="text-muted-foreground">
              Connect with people who speak the language you want to learn.
            </p>
          </div>
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Languages className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Translation Assistance</h3>
            <p className="text-muted-foreground">
              Get help with translations when you're stuck in a conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground">© 2023 roshLingua. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
