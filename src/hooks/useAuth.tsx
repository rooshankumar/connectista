
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase, createRequiredTables } from '@/lib/supabase';
import type { Profile } from '@/lib/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch the user's profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user ID:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      console.log('Profile data retrieved:', data);
      return data as Profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Initialize or create user profile
  const initializeUserProfile = async (user: User) => {
    try {
      // Check if profile exists
      console.log('Checking if profile exists for user:', user.id);
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (fetchError) {
        if (fetchError.code === '42P01') {
          // Table doesn't exist, try to create it
          console.log('Profiles table does not exist, trying to initialize database...');
          await createRequiredTables();
          return null;
        } else if (fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
          console.error('Error checking for existing profile:', fetchError);
          return null;
        }
      }
      
      // If profile doesn't exist, create it with default values
      if (!existingProfile) {
        console.log('Creating new profile for user:', user.id);
        
        // Extract email username for default username
        const defaultUsername = user.email ? user.email.split('@')[0] : `user_${Date.now()}`;
        
        const newProfile = {
          id: user.id,
          username: defaultUsername,
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          onboarding_completed: false,
          created_at: new Date().toISOString(),
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating profile:', createError);
          return null;
        }
        
        console.log('New profile created:', createdProfile);
        return createdProfile as Profile;
      }
      
      console.log('Existing profile found:', existingProfile);
      return existingProfile as Profile;
    } catch (error) {
      console.error('Error in initializeUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        console.log('Initializing auth and getting session...');
        // Check and create necessary tables/buckets
        await createRequiredTables();
        
        // Get the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }
        
        if (data?.session) {
          console.log('Session found:', data.session.user.id);
          setSession(data.session);
          setUser(data.session.user);
          
          // Initialize or fetch user profile
          const profileData = await initializeUserProfile(data.session.user);
          setProfile(profileData);
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast.error('Authentication error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event);
      
      if (newSession) {
        console.log('New session established:', newSession.user.id);
        setSession(newSession);
        setUser(newSession.user);
        
        // Initialize or fetch user profile
        const profileData = await initializeUserProfile(newSession.user);
        setProfile(profileData);
      } else {
        console.log('Session ended');
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting to sign up user with email:', email);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (!error) {
        console.log('Sign up successful');
        toast.success('Sign up successful! Please check your email to verify your account.');
      } else {
        console.error('Sign up error:', error);
        toast.error(`Sign up failed: ${error.message}`);
      }
      
      return { error };
    } catch (error) {
      console.error('Error during sign up:', error);
      toast.error(`Sign up failed: ${(error as Error).message}`);
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting to sign in user with email:', email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (!error) {
        console.log('Sign in successful');
        toast.success('Sign in successful!');
        navigate('/dashboard');
      } else {
        console.error('Sign in error:', error);
        toast.error(`Sign in failed: ${error.message}`);
      }
      
      return { error };
    } catch (error) {
      console.error('Error during sign in:', error);
      toast.error(`Sign in failed: ${(error as Error).message}`);
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      console.log('Attempting to sign in with Google');
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      console.log('Attempting to sign out');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user && !!session;

  const value = {
    user,
    session,
    profile,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
