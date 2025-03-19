
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background antialiased">
      <header className="fixed top-0 left-0 right-0 flex items-center justify-end p-4 z-10">
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mx-auto mb-8 flex flex-col items-center justify-center gap-1 text-center">
            <Link to="/">
              <h1 className="text-3xl font-bold text-primary tracking-tight">
                roshLingua
              </h1>
            </Link>
            <div className="relative flex items-center justify-center w-full py-4">
              <div className="absolute left-0 right-0 h-[1px] bg-border" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          
          <div className="p-6 bg-card rounded-2xl shadow-sm border animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
