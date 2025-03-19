
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
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
