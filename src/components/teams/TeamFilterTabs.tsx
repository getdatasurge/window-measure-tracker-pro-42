
import React from 'react';

interface TeamFilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TeamFilterTabs: React.FC<TeamFilterTabsProps> = ({ 
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'all-teams', label: 'All Teams' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'specialty', label: 'Specialty' }
  ];

  return (
    <div className="border-b border-zinc-800/70 dark:border-zinc-800/70 border-gray-300/70 mb-6 overflow-x-auto">
      <div className="flex whitespace-nowrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-4 py-2 text-sm font-medium relative
              ${activeTab === tab.id 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TeamFilterTabs;
