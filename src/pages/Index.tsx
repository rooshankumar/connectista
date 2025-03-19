
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MessageCircle, Globe, Languages, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const features = [
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: 'Connect Globally',
      description: 'Find language partners from around the world who share your learning goals.',
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: 'Real-time Chat',
      description: 'Communicate with native speakers through instant messaging with translation assistance.',
    },
    {
      icon: <Languages className="h-10 w-10 text-primary" />,
      title: 'Language Exchange',
      description: 'Practice your target language while helping others learn your native language.',
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: 'Track Progress',
      description: 'Monitor your language learning journey with achievement badges and statistics.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background antialiased">
      <header className="w-full border-b px-6 py-4">
        <div className="container flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">roshLingua</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6 text-center md:text-left">
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Learn languages with real conversations
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Connect with native speakers worldwide and improve your language skills through authentic exchanges.
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Button 
                    size="lg" 
                    className="text-lg px-8"
                    onClick={() => navigate('/signup')}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8"
                    onClick={() => navigate('/login')}
                  >
                    Learn More
                  </Button>
                </motion.div>
              </div>
              <motion.div 
                className="flex-1 flex justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="relative w-full max-w-md h-[500px]">
                  <div className="absolute top-0 right-0 w-4/5 h-4/5 bg-primary/5 rounded-xl border"></div>
                  <div className="absolute bottom-0 left-0 w-4/5 h-4/5 bg-primary/10 rounded-xl border"></div>
                  <div className="absolute inset-0 m-auto w-3/4 h-3/4 bg-card rounded-xl border shadow-lg flex items-center justify-center">
                    <div className="p-6 text-center">
                      <MessageCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">Start chatting now</h3>
                      <p className="text-muted-foreground mb-4">Connect with language partners around the world</p>
                      <Button className="w-full">Sign Up Free</Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-secondary">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How roshLingua Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform makes language learning natural, effective, and enjoyable through real conversations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-primary/5 rounded-2xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start your language journey?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of language learners using roshLingua to achieve fluency through real-world conversations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto justify-center">
                <Button 
                  size="lg" 
                  className="text-lg px-8 flex-1"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up Free
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 flex-1"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold text-foreground">roshLingua</h2>
              <p className="text-muted-foreground mt-2">Connect. Chat. Learn.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <a href="#" className="text-muted-foreground hover:text-primary">About Us</a>
              <a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-primary">Contact</a>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} roshLingua. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
