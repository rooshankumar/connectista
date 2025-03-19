
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/hooks/useAuth';

type AppLayoutProps = {
  children: ReactNode;
  requireAuth?: boolean;
};

export function AppLayout({ children, requireAuth = true }: AppLayoutProps) {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    
    if (requireAuth && !isAuthenticated) {
      navigate('/login');
    } else if (isAuthenticated && profile && !profile.onboarding_completed) {
      navigate('/onboarding');
    }
  }, [isAuthenticated, isLoading, navigate, requireAuth, profile]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse-soft text-center">
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
