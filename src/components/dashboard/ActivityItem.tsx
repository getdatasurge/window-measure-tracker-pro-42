
import React from 'react';

interface ActivityItemProps {
  avatar: string;
  name: string;
  action: string;
  target: string;
  timestamp: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  avatar, 
  name, 
  action, 
  target,
  timestamp 
}) => {
  return (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start">
        <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-sm">
            <span className="font-medium">{name}</span> {action}{' '}
            <span className="font-medium">{target}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">{timestamp}</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
