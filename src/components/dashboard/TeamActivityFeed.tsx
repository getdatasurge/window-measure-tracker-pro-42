
import React from 'react';

interface TeamActivity {
  id: number;
  avatar: string;
  name: string;
  action: string;
  target?: string;
  targetType?: 'project' | 'team' | 'measurement';
  timeAgo: string;
}

const TeamActivityFeed: React.FC = () => {
  const activities: TeamActivity[] = [
    {
      id: 1,
      avatar: '/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png',
      name: 'John Smith',
      action: 'added 12 measurements to',
      target: 'Downtown Office Tower',
      targetType: 'project',
      timeAgo: '2 hours ago'
    },
    {
      id: 2,
      avatar: '/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png',
      name: 'Sarah Johnson',
      action: 'created a new project',
      target: 'Greenview Mall',
      targetType: 'project',
      timeAgo: '5 hours ago'
    },
    {
      id: 3,
      avatar: '/lovable-uploads/1147f83d-d82c-4ab7-a3de-51400ce914c1.png',
      name: 'Mike Davis',
      action: 'completed all measurements for',
      target: 'Riverside Apartments',
      targetType: 'project',
      timeAgo: 'Yesterday'
    },
    {
      id: 4,
      avatar: '/lovable-uploads/211d8c12-4057-4c0f-80e4-5191abc30c81.png',
      name: 'Lisa Chen',
      action: 'updated the deadline for',
      target: 'Lakeside Hotel',
      targetType: 'project',
      timeAgo: '2 days ago'
    },
    {
      id: 5,
      avatar: '/lovable-uploads/ba4d7a6f-6bb7-4c0a-a30b-19d87ec003f2.png',
      name: 'Tom Wilson',
      action: 'joined the team',
      timeAgo: '1 week ago'
    }
  ];

  const getTargetStyles = (targetType?: 'project' | 'team' | 'measurement') => {
    switch (targetType) {
      case 'project':
        return 'text-green-400';
      case 'team':
        return 'text-blue-400';
      case 'measurement':
        return 'text-purple-400';
      default:
        return 'text-zinc-200';
    }
  };

  return (
    <div className="bg-zinc-800 rounded-xl shadow-lg p-4 h-full">
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className="shrink-0">
              <img 
                src={activity.avatar} 
                alt={activity.name} 
                className="h-9 w-9 rounded-full object-cover border border-zinc-700"
              />
            </div>
            <div>
              <p className="text-sm">
                <span className="font-medium">{activity.name}</span>{' '}
                <span className="text-zinc-400">{activity.action}</span>{' '}
                {activity.target && (
                  <span className={getTargetStyles(activity.targetType)}>
                    {activity.target}
                  </span>
                )}
              </p>
              <p className="text-xs text-zinc-500 mt-1">{activity.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamActivityFeed;
