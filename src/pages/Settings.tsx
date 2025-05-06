import React, { useState, useEffect } from 'react';
import { 
  SettingsTabs,
  AccountSettings,
  ApplicationPreferences,
  DisplaySettings,
  NotificationSettings,
  DataPrivacy
} from '@/components/settings';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('green');
  const [density, setDensity] = useState('regular');
  const [fontSize, setFontSize] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '', // We'll map this to phone_number in the database
    jobTitle: '',
    avatarUrl: '',
    role: '' // Added role field to store the user's role
  });
  
  const { user, profile, refreshProfile } = useAuth();
  
  // Load user data when component mounts or when user/profile changes
  useEffect(() => {
    if (user && profile) {
      // Parse full name into first and last name
      const nameParts = (profile.full_name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData({
        firstName,
        lastName,
        email: user.email || '',
        phone: profile.phone_number || '', // Map from phone_number in the database to phone in the form
        jobTitle: profile.role || '',
        avatarUrl: profile.avatar_url || '',
        role: profile.role || '' // Store the user's role
      });
      
      setIsLoading(false);
    }
  }, [user, profile]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveChanges = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      // Combine first and last name into full name and trim whitespace
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      // Update profile in Supabase with the correct column names
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone_number: formData.phone || null, // Map to the correct column name
          role: formData.jobTitle || null,
          avatar_url: formData.avatarUrl || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Refresh the profile in the auth context to update UI across the app
      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="space-y-8">
          <AccountSettings 
            formData={formData}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
            setFormData={setFormData}
          />
          <ApplicationPreferences />
          <DisplaySettings 
            theme={theme}
            setTheme={setTheme}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            density={density}
            setDensity={setDensity}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
          <NotificationSettings />
          <DataPrivacy />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          className="px-4 py-2 text-gray-700 font-medium mr-4"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button 
          className={`px-6 py-2 bg-wintrack-green hover:bg-wintrack-green-dark text-white font-medium rounded ${
            isSaving ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          onClick={handleSaveChanges}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default Settings;
