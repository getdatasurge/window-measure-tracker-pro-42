
import React from 'react';

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'profile', label: 'Profile' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'display', label: 'Display' },
    { id: 'teams', label: 'Teams' },
    { id: 'security', label: 'Security' },
    { id: 'integrations', label: 'Integrations' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-3 mb-4 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === tab.id
              ? 'bg-wintrack-dark-blue text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SettingsTabs;
