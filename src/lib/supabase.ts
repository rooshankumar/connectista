
import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env.local file.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: 'roshlingua-auth-storage',
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
});

// Add console message to check the connection
console.log('Initializing Supabase client with URL:', supabaseUrl);

// Create Tables SQL Helper
export const createRequiredTables = async () => {
  console.log('Checking and creating required database tables...');
  
  try {
    // Check if profiles table exists
    const { error: checkProfilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      .single();
    
    // If profiles table doesn't exist, create it
    if (checkProfilesError && checkProfilesError.code === '42P01') {
      console.log('Creating profiles table...');
      const { error: createProfilesError } = await supabase.rpc('create_profiles_table');
      if (createProfilesError) {
        console.error('Error creating profiles table:', createProfilesError);
      } else {
        console.log('Profiles table created successfully');
      }
    }
    
    // Check if storage bucket exists
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const profilesBucketExists = buckets?.some(bucket => bucket.name === 'profiles');
      
      if (!profilesBucketExists) {
        console.log('Creating profiles storage bucket...');
        await supabase.storage.createBucket('profiles', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
        console.log('Profiles bucket created successfully');
      }
    } catch (storageError) {
      console.error('Error with storage buckets:', storageError);
    }
    
    // Check if conversations table exists
    const { error: checkConversationsError } = await supabase
      .from('conversations')
      .select('count')
      .limit(1)
      .single();
    
    // If conversations table doesn't exist, create it
    if (checkConversationsError && checkConversationsError.code === '42P01') {
      console.log('Creating conversations table...');
      const { error: createConversationsError } = await supabase.rpc('create_conversations_table');
      if (createConversationsError) {
        console.error('Error creating conversations table:', createConversationsError);
      } else {
        console.log('Conversations table created successfully');
      }
    }
    
    // Check if messages table exists
    const { error: checkMessagesError } = await supabase
      .from('messages')
      .select('count')
      .limit(1)
      .single();
    
    // If messages table doesn't exist, create it
    if (checkMessagesError && checkMessagesError.code === '42P01') {
      console.log('Creating messages table...');
      const { error: createMessagesError } = await supabase.rpc('create_messages_table');
      if (createMessagesError) {
        console.error('Error creating messages table:', createMessagesError);
      } else {
        console.log('Messages table created successfully');
      }
    }
    
  } catch (error) {
    console.error('Error checking/creating tables:', error);
  }
};

// Define types for database tables
export type Profile = {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  native_language?: string;
  learning_languages?: string[];
  bio?: string;
  date_of_birth?: string;
  proficiency_level?: string;
  onboarding_completed: boolean;
  created_at: string;
  last_online?: string;
  is_online?: boolean;
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
