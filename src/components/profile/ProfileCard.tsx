
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Loader2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Profile } from '@/lib/supabase';

export function ProfileCard() {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile, uploadAvatar } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    native_language: profile?.native_language || '',
    learning_languages: profile?.learning_languages || [],
  });

  // Update form data when profile changes
  useState(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        native_language: profile.native_language || '',
        learning_languages: profile.learning_languages || [],
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadAvatar(file);
      if (result.error) {
        throw result.error;
      }
      toast.success('Avatar uploaded successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(`Failed to upload avatar: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const result = await updateProfile(formData);
      if (result.error) {
        throw result.error;
      }
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${(error as Error).message}`);
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || '?';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border overflow-hidden animate-fade-in">
      <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10"></div>
      
      <div className="p-6 -mt-16">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || "User avatar"} />
              <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
            </Avatar>
            
            {!isUploading && (
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                  <Camera className="h-4 w-4" />
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={isUploading}
                />
                <span className="sr-only">Change avatar</span>
              </label>
            )}
            
            {isUploading && (
              <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="native_language">Native Language</Label>
                  <Input
                    id="native_language"
                    name="native_language"
                    value={formData.native_language}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">{profile?.full_name || user?.email?.split('@')[0] || 'User'}</h2>
                <p className="text-muted-foreground">
                  {profile?.native_language 
                    ? `Native: ${profile.native_language}` 
                    : 'No language specified'}
                </p>
                <p className="mt-4">{profile?.bio || 'No bio yet.'}</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 md:mt-0">
            {isEditing ? (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
