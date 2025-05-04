
import React, { useState } from 'react';
import { 
  SettingsTabs,
  AccountSettings,
  ApplicationPreferences,
  DisplaySettings,
  NotificationSettings,
  DataPrivacy
} from '@/components/settings';

const Settings = () => {
  const [accountTab, setAccountTab] = useState('account');
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('green');
  const [density, setDensity] = useState('regular');
  const [fontSize, setFontSize] = useState(50);
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <SettingsTabs activeTab={accountTab} setActiveTab={setAccountTab} />
        
        <div className="space-y-8">
          <AccountSettings />
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
        <button className="px-4 py-2 text-gray-700 font-medium mr-4">
          Cancel
        </button>
        <button className="px-6 py-2 bg-wintrack-green hover:bg-wintrack-green-dark text-white font-medium rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
