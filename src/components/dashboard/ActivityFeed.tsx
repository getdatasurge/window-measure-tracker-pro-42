
import React from 'react';
import ActivityItem from './ActivityItem';

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 1,
      avatar: '/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png',
      name: 'Sarah Johnson',
      action: 'added new measurements to',
      target: 'Lakeside Residence',
      timestamp: 'Today, 9:41 AM'
    },
    {
      id: 2,
      avatar: '/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png',
      name: 'Alex Morgan',
      action: 'created a new project',
      target: 'Downtown Office Complex',
      timestamp: 'Today, 8:27 AM'
    },
    {
      id: 3,
      avatar: '/lovable-uploads/1147f83d-d82c-4ab7-a3de-51400ce914c1.png',
      name: 'Emma Chen',
      action: 'updated measurements for',
      target: 'Harbor View Apartments',
      timestamp: 'Yesterday, 4:30 PM'
    },
    {
      id: 4,
      avatar: '/lovable-uploads/211d8c12-4057-4c0f-80e4-5191abc30c81.png',
      name: 'David Wilson',
      action: 'completed measurements for',
      target: 'Sunnyvale Residence',
      timestamp: 'Yesterday, 2:15 PM'
    },
    {
      id: 5,
      avatar: '/lovable-uploads/e9f29315-c127-4c60-97d6-bc6eb6936a7a.png',
      name: 'Michael Brown',
      action: 'added new team member',
      target: 'Lisa Chen',
      timestamp: 'Jun 29, 10:30 AM'
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Activity Feed</h2>
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
        </button>
      </div>
      
      <div className="space-y-1">
        {activities.map((activity) => (
          <ActivityItem 
            key={activity.id}
            avatar={activity.avatar}
            name={activity.name}
            action={activity.action}
            target={activity.target}
            timestamp={activity.timestamp}
          />
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Activities
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;
