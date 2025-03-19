
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Profile } from '@/lib/supabase';

export const useProfile = () => {
  const { user, profile: authProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return { error: new Error('User not authenticated') };
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      toast.error('You must be logged in to upload an avatar');
      return { error: new Error('User not authenticated'), url: null };
    }

    setIsLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: data.publicUrl });

      return { error: null, url: data.publicUrl };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
      return { error, url: null };
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async (profileData: Partial<Profile>) => {
    if (!user) {
      toast.error('You must be logged in to complete onboarding');
      return { error: new Error('User not authenticated') };
    }

    setIsLoading(true);

    try {
      const updates = {
        ...profileData,
        onboarding_completed: true,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Onboarding completed successfully');
      return { error: null };
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding');
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile: authProfile,
    isLoading,
    updateProfile,
    uploadAvatar,
    completeOnboarding,
  };
};
