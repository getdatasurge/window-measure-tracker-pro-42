
import React, { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // This is mapped to phone_number in the database
  jobTitle: string;
  avatarUrl: string;
  role?: string; // Added optional role field
}

interface AccountSettingsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isLoading: boolean;
  setFormData?: (data: FormData) => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ 
  formData,
  handleInputChange,
  isLoading,
  setFormData
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Only image files are allowed."
      });
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 10MB."
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
      // Create a file path using the user's ID
      const filePath = `${user.id}/avatar.${fileExt}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      
      // Update formData with the new avatar URL
      if (setFormData) {
        setFormData({
          ...formData,
          avatarUrl: publicUrl
        });
      }
      
      // Update the profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been successfully updated."
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload avatar."
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
    return <div className="flex justify-center py-8">
      <Spinner className="w-8 h-8 text-wintrack-green" />
    </div>;
  }
  
  return (
    <div>
      <div>
        <h2 className="text-xl font-semibold mb-1">Account Settings</h2>
        <p className="text-sm text-gray-500">Manage your account information and preferences</p>
      </div>
      
      {/* Account Information */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Account Information</h3>
        
        <div className="flex items-center mb-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              {formData.avatarUrl ? (
                <AvatarImage 
                  src={formData.avatarUrl} 
                  alt="Profile"
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-wintrack-dark-blue text-white text-xl">
                  {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-wintrack-dark-blue text-white p-1.5 rounded-full cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4H8C7.44772 4 7 4.44772 7 5V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V5C17 4.44772 16.5523 4 16 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
          <label htmlFor="avatar-upload" className="ml-4 text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            {isUploading ? "Uploading..." : "Change Photo"}
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input 
              type="text" 
              id="firstName"
              name="firstName"
              className="search-input" 
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input 
              type="text" 
              id="lastName"
              name="lastName" 
              className="search-input" 
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              id="email"
              name="email"
              className="search-input bg-gray-100" 
              value={formData.email}
              onChange={handleInputChange}
              readOnly
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              id="phone"
              name="phone" 
              className="search-input" 
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input 
              type="text" 
              id="jobTitle"
              name="jobTitle" 
              className="search-input" 
              value={formData.jobTitle}
              onChange={handleInputChange}
            />
          </div>
          
          {/* New read-only Role field */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input 
              type="text" 
              id="role"
              name="role" 
              className="search-input bg-gray-100 text-gray-500" 
              value={formData.role || 'None'}
              readOnly
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Your system role cannot be changed</p>
          </div>
          
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select id="department" className="search-input">
              <option value="installation">Installation</option>
              <option value="sales">Sales</option>
              <option value="management">Management</option>
              <option value="engineering">Engineering</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
