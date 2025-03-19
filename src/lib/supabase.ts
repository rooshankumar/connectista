
import { createClient } from '@supabase/supabase-js';

// Default to demo credentials if environment variables are not set
// In production, these would come from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZmd3Y3dvcWZ1cHZpaHpqZmh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ1OTcwMDYsImV4cCI6MTk5MDE3MzAwNn0.i97waJfwRxMhfdNkHtAZbrFH8J_cDnXUNdPgHZ5J4Ng';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using demo Supabase credentials. For production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  native_language?: string;
  learning_languages?: string[];
  bio?: string;
  onboarding_completed: boolean;
  created_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  image_url?: string;
  is_translated?: boolean;
  original_content?: string;
  created_at: string;
  seen: boolean;
};

export type Conversation = {
  id: string;
  created_at: string;
  participants: string[];
  last_message?: string;
  last_message_time?: string;
};
