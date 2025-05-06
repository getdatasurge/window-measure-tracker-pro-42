
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardShell from '@/components/layout/DashboardShell';
import UserProfileForm from '@/components/settings/UserProfileForm';
import ApplicationSettingsCard from '@/components/settings/ApplicationSettingsCard';
import NotificationPreferences from '@/components/settings/NotificationPreferences';
import DefaultProjectSettings from '@/components/settings/DefaultProjectSettings';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const SettingsTabs = [
  { id: 'account', label: 'Account' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'security', label: 'Security' },
  { id: 'team-access', label: 'Team Access' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'billing', label: 'Billing' }
];

const UserSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  
  // Only fetch data if viewing another user's profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!id || (user && id === user.id)) {
        // Using current user's profile
        setProfileData(profile);
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: "Error",
          description: "Could not load user profile",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [id, user, profile]);
  
  const handleProfileUpdate = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone || null,
          role: formData.jobTitle || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Profile has been successfully updated",
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating the profile",
        variant: "destructive"
      });
    }
  };
  
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-zinc-700/50">
          <div className="flex space-x-6 overflow-x-auto">
            {SettingsTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-green-400 text-green-400'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'account' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <UserProfileForm 
                userId={id} 
                initialData={profileData}
                isLoading={isLoading}
                onSave={handleProfileUpdate}
              />
            </div>
            <div className="space-y-6">
              <ApplicationSettingsCard />
              <DefaultProjectSettings />
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div>
            <NotificationPreferences />
          </div>
        )}
        
        {/* Other tabs content would go here */}
      </div>
    </DashboardShell>
  );
};

export default UserSettingsPage;
