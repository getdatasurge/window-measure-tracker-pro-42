import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth';

interface UserProfileFormProps {
  userId?: string;
  initialData?: any;
  isLoading?: boolean;
  onSave?: (formData: FormData) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // This is mapped to phone_number in the database
  jobTitle: string;
  avatarUrl?: string;
}

const UserProfileForm = ({ userId, initialData, isLoading = false, onSave }: UserProfileFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { refreshProfile } = useAuth();
  
  useEffect(() => {
    if (initialData) {
      // Parse full name into first and last name
      const nameParts = (initialData.full_name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData({
        firstName,
        lastName,
        email: initialData.email || '',
        phone: initialData.phone_number || '', // Map from phone_number in database to phone in form
        jobTitle: initialData.role || '',
        avatarUrl: initialData.avatar_url
      });
    }
  }, [initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (onSave) {
        await onSave(formData);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Only image files are allowed.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 10MB.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Get the current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("You must be logged in to upload an avatar.");
      }
      
      // Get file extension
      const fileExt = file.name.split('.').pop();
      // Create a file path using userId or the current user's ID
      const filePath = `${userId || user.id}/avatar.${fileExt}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      
      // Update local state with the new avatar URL
      setFormData(prev => ({
        ...prev,
        avatarUrl: publicUrl
      }));
      
      // Always update the profile in the database regardless of the onSave prop
      const updateUserId = userId || user.id;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', updateUserId);
        
      if (updateError) throw updateError;
      
      // Call refreshProfile to update the auth context with the new avatar URL
      await refreshProfile();
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been successfully updated.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload avatar.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      
      // Reset the file input
      if (e.target) {
        e.target.value = '';
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 flex items-center justify-center h-64">
        <Spinner className="w-8 h-8 text-green-500" />
      </div>
    );
  }
  
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
      
      <div className="mb-6 flex items-center">
        <div className="relative">
          <Avatar className="w-20 h-20">
            {formData.avatarUrl ? (
              <AvatarImage src={formData.avatarUrl} alt="Profile" />
            ) : (
              <AvatarFallback className="text-xl bg-zinc-700">
                {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          
          <label htmlFor="avatar-upload" className="absolute right-0 bottom-0 bg-green-600 rounded-full p-1.5 text-white cursor-pointer hover:bg-green-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
            <input 
              id="avatar-upload" 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </label>
        </div>
        <label htmlFor="avatar-upload" className="ml-4 text-sm text-green-400 hover:text-green-300 cursor-pointer">
          {isUploading ? "Uploading..." : "Change Photo"}
        </label>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-zinc-400 mb-1">
              First Name
            </label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="bg-zinc-900/50 border-zinc-700 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-zinc-400 mb-1">
              Last Name
            </label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="bg-zinc-900/50 border-zinc-700 text-white"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              readOnly
              disabled
              className="bg-zinc-900/50 border-zinc-700 text-white opacity-70"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-400 mb-1">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="bg-zinc-900/50 border-zinc-700 text-white"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="jobTitle" className="block text-sm font-medium text-zinc-400 mb-1">
              Job Title
            </label>
            <Input
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="bg-zinc-900/50 border-zinc-700 text-white"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isSaving || isUploading}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
