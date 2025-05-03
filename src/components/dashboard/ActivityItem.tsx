
import React from 'react';
import { FileText, CheckCircle, Users, AlertTriangle } from 'lucide-react';

interface ActivityItemProps {
  avatar: string;
  name: string;
  action: string;
  target: string;
  timestamp: string;
  icon?: 'measurement' | 'complete' | 'team' | 'issue';
}

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  avatar, 
  name, 
  action, 
  target,
  timestamp,
  icon
}) => {
  const getIconColor = () => {
    switch (icon) {
      case 'measurement':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'complete':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'team':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'issue':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400';
    }
  };
  
  const renderIcon = () => {
    switch (icon) {
      case 'measurement':
        return <FileText size={16} />;
      case 'complete':
        return <CheckCircle size={16} />;
      case 'team':
        return <Users size={16} />;
      case 'issue':
        return <AlertTriangle size={16} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
      {icon ? (
        <div className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ${getIconColor()} flex items-center justify-center`}>
          {renderIcon()}
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="text-sm leading-snug">
          <span className="font-semibold">{name}</span> {action}{' '}
          <span className="font-semibold">{target}</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{timestamp}</div>
      </div>
    </div>
  );
};

export default ActivityItem;
