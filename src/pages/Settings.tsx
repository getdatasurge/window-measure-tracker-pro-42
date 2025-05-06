
import React, { useState, useEffect } from 'react';
import { 
  SettingsTabs,
  ApplicationPreferences,
  DisplaySettings,
  NotificationSettings,
  DataPrivacy
} from '@/components/settings';
import ProfileForm, { ProfileFormData } from '@/components/settings/ProfileForm';
import { useSessionProfile } from '@/contexts/session-profile';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('green');
  const [density, setDensity] = useState('regular');
  const [fontSize, setFontSize] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile form data
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    avatarUrl: '',
    role: ''
  });
  
  const { user, profile } = useSessionProfile();
  
  // Load user data when component mounts or when user/profile changes
  useEffect(() => {
    if (user && profile) {
      setIsLoading(true);
      
      // Parse full name into first and last name
      const nameParts = (profile.full_name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData({
        firstName,
        lastName,
        email: user.email || '',
        phone: profile.phone_number || '',
        jobTitle: profile.role || '',
        avatarUrl: profile.avatar_url || '',
        role: profile.role || ''
      });
      
      setIsLoading(false);
    }
  }, [user, profile]);
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="space-y-8 mt-6">
          {activeTab === 'account' && (
            <ProfileForm 
              initialData={formData}
              isLoading={isLoading}
            />
          )}
          {activeTab === 'preferences' && (
            <ApplicationPreferences />
          )}
          {activeTab === 'display' && (
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
          )}
          {activeTab === 'notifications' && (
            <NotificationSettings />
          )}
          {activeTab === 'privacy' && (
            <DataPrivacy />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
