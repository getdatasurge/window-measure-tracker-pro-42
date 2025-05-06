
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  avatarUrl?: string;
  role?: string;
}

interface ProfileFormProps {
  userId?: string;
  initialData?: ProfileFormData;
  isLoading?: boolean;
  onSuccess?: () => void;
  readOnly?: boolean;
}

const ProfileForm = ({ 
  userId, 
  initialData, 
  isLoading = false, 
  onSuccess, 
  readOnly = false 
}: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    role: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const { user, refreshProfile } = useAuth();
  
  // Initialize form with provided initialData or from user context
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (readOnly) return;
    
    // Ensure user is authenticated
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
    if (!currentUser || authError) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive"
      });
      return;
    }
    
    // Use provided userId or fall back to current user id
    const targetUserId = userId || currentUser.id;
    setIsSaving(true);
    
    try {
      // Combine first and last name into full name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      // Prepare update data
      const updates = {
        full_name: fullName,
        phone_number: formData.phone || null,
        role: formData.jobTitle || null,
        avatar_url: formData.avatarUrl || null,
        updated_at: new Date().toISOString()
      };
      
      // Update profile in Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', targetUserId);
      
      if (updateError) throw updateError;
      
      // Refresh profile context data
      await refreshProfile();
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Only image files are allowed.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 10MB.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Get the current authenticated user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser) {
        throw new Error("You must be logged in to upload an avatar.");
      }
      
      // Use provided userId or fall back to current user id
      const targetUserId = userId || currentUser.id;
      
      // Get file extension
      const fileExt = file.name.split('.').pop();
      // Create a file path using the user's ID with timestamp to prevent caching
      const timestamp = new Date().getTime();
      const filePath = `${targetUserId}/avatar_${timestamp}.${fileExt}`;
      
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
      
      // Update the profile in the database with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', targetUserId);
        
      if (updateError) throw updateError;
      
      // Refresh the profile context
      await refreshProfile();
      
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been successfully updated.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload Failed",
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
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-2 border-t-wintrack-green rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Add a cache-busting parameter to the avatar URL to prevent stale images
  const avatarUrlWithCache = formData.avatarUrl 
    ? `${formData.avatarUrl}?t=${new Date().getTime()}` 
    : '';
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <Avatar className="w-20 h-20">
            {avatarUrlWithCache ? (
              <AvatarImage src={avatarUrlWithCache} alt="Profile picture" />
            ) : (
              <AvatarFallback className={`text-lg ${readOnly ? 'bg-gray-300' : 'bg-wintrack-dark-blue text-white'}`}>
                {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          
          {!readOnly && (
            <label htmlFor="avatar-upload" className="absolute right-0 bottom-0 bg-wintrack-green text-white p-1.5 rounded-full cursor-pointer hover:bg-wintrack-green-dark">
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
                disabled={isUploading || readOnly}
              />
            </label>
          )}
        </div>
        
        {!readOnly && (
          <label htmlFor="avatar-upload" className="text-sm text-wintrack-green-dark hover:text-wintrack-green cursor-pointer">
            {isUploading ? "Uploading..." : "Change Photo"}
          </label>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={readOnly ? "bg-gray-100" : ""}
            readOnly={readOnly}
            disabled={readOnly}
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={readOnly ? "bg-gray-100" : ""}
            readOnly={readOnly}
            disabled={readOnly}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            readOnly
            disabled
            className="bg-gray-100 text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={readOnly ? "bg-gray-100" : ""}
            readOnly={readOnly}
            disabled={readOnly}
          />
        </div>
        
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <Input
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className={readOnly ? "bg-gray-100" : ""}
            readOnly={readOnly}
            disabled={readOnly}
          />
        </div>
        
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <Input
            id="role"
            name="role"
            value={formData.role || 'None'}
            readOnly
            disabled
            className="bg-gray-100 text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">Your system role cannot be changed</p>
        </div>
      </div>
      
      {!readOnly && (
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-wintrack-green hover:bg-wintrack-green-dark text-white"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
