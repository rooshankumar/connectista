
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

type AppLayoutProps = {
  children: ReactNode;
  requireAuth?: boolean;
};

export function AppLayout({ children, requireAuth = true }: AppLayoutProps) {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Don't redirect while still loading auth state
    if (isLoading) return;
    
    if (requireAuth && !isAuthenticated) {
      setIsRedirecting(true);
      navigate('/login');
      return;
    } 
    
    if (isAuthenticated && profile && !profile.onboarding_completed) {
      setIsRedirecting(true);
      navigate('/onboarding');
      return;
    }

    setIsRedirecting(false);
  }, [isAuthenticated, isLoading, navigate, requireAuth, profile]);

  if (isLoading || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Loading...</h2>
          <p className="text-muted-foreground mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col bg-background antialiased">
      <Navbar />
      <main className="flex-1 container py-6">
        {children}
      </main>
    </div>
  );
}
