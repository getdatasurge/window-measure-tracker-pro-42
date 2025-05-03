
import React from 'react';
import ActivityItem from './ActivityItem';

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 1,
      avatar: '/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png',
      name: 'Michael',
      action: 'added 12 window measurements to',
      target: 'Downtown Office Complex',
      timestamp: 'Today, 9:41 AM',
      icon: 'measurement'
    },
    {
      id: 2,
      avatar: '/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png',
      name: 'Hillside Apartments',
      action: 'project has been marked as',
      target: 'complete',
      timestamp: 'Yesterday, 9:23 PM',
      icon: 'complete'
    },
    {
      id: 3,
      avatar: '/lovable-uploads/1147f83d-d82c-4ab7-a3de-51400ce914c1.png',
      name: 'Sarah Johnson',
      action: 'has joined the',
      target: 'Commercial team',
      timestamp: 'Yesterday, 2:15 PM',
      icon: 'team'
    },
    {
      id: 4,
      avatar: '/lovable-uploads/211d8c12-4057-4c0f-80e4-5191abc30c81.png',
      name: 'Discrepancy found',
      action: 'in Memorial Hospital',
      target: '3rd floor measurements',
      timestamp: 'Yesterday, 11:12 AM',
      icon: 'issue'
    }
  ];
  
  return (
    <div className="backdrop-blur-md bg-white/80 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700/40 rounded-lg shadow-md p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <ActivityItem 
            key={activity.id}
            avatar={activity.avatar}
            name={activity.name}
            action={activity.action}
            target={activity.target}
            timestamp={activity.timestamp}
            icon={activity.icon}
          />
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
          View All Activities
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;
