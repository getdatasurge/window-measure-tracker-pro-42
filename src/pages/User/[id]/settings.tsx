import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardShell from '@/components/layout/DashboardShell';
import UserProfileForm from '@/components/settings/UserProfileForm';
import ApplicationSettingsCard from '@/components/settings/ApplicationSettingsCard';
import NotificationPreferences from '@/components/settings/NotificationPreferences';
import DefaultProjectSettings from '@/components/settings/DefaultProjectSettings';
import { useAuth } from '@/contexts/auth';
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
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // If not authenticated, we can't fetch any profile
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const fetchUserProfile = async () => {
      // Special case for "current" - use the authenticated user's ID
      if (id === 'current') {
        if (profile) {
          // If we already have the profile from auth context, use it
          setProfileData(profile);
          setIsLoading(false);
          return;
        }
        
        // Otherwise fetch the current user's profile
        try {
          const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !currentUser) {
            throw new Error(userError?.message || "Not authenticated");
          }
          
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
            
          if (error) throw error;
          setProfileData(data);
        } catch (error) {
          console.error('Error fetching current user profile:', error);
          toast({
            title: "Error",
            description: "Could not load your profile. Please try again later.",
            variant: "destructive"
          });
          
          // Redirect to dashboard if we can't load the profile
          navigate('/');
        } finally {
          setIsLoading(false);
        }
        return;
      }
      
      // For other user IDs (when viewing someone else's profile)
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
  }, [id, user, profile, navigate]);
  
  const handleProfileUpdate = async (formData: any) => {
    try {
      // Determine the correct user ID to update
      const userId = id === 'current' ? user?.id : id;
      
      if (!userId) {
        throw new Error("No user ID available for update");
      }
      
      // Combine first and last name into full name and trim whitespace
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone_number: formData.phone || null, // Map to correct column name
          role: formData.jobTitle || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Refresh the profile in the auth context to update UI across the app
      await refreshProfile();
      
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
                userId={id === 'current' ? user?.id : id} 
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
