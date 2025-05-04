
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const activityItems = [
  {
    user: {
      name: 'Sarah Wilson',
      avatar: '/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png',
      initials: 'SW'
    },
    action: 'measured',
    project: 'Harbor View Apartments',
    time: '2 hours ago',
    status: 'completed'
  },
  {
    user: {
      name: 'Alex Johnson',
      avatar: '/placeholder.svg',
      initials: 'AJ'
    },
    action: 'uploaded photos of',
    project: 'Downtown Office Complex',
    time: '3 hours ago',
    status: 'in-progress'
  },
  {
    user: {
      name: 'Michael Brown',
      avatar: '/placeholder.svg',
      initials: 'MB'
    },
    action: 'created',
    project: 'Sunnyvale Residence',
    time: '5 hours ago',
    status: 'just-started'
  },
  {
    user: {
      name: 'Emma Davis',
      avatar: '/placeholder.svg',
      initials: 'ED'
    },
    action: 'finalized',
    project: 'Lakeview Community Center',
    time: 'Yesterday',
    status: 'completed'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 text-green-300';
    case 'in-progress':
      return 'bg-indigo-500/20 text-indigo-300';
    case 'just-started':
      return 'bg-blue-500/20 text-blue-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
  }
};

const ActivityFeed = () => {
  return (
    <Card className="bg-zinc-800/50 border border-zinc-700/50 shadow-lg">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Team Activity</h2>
        
        <div className="space-y-4">
          {activityItems.map((item, index) => (
            <div key={index} className="flex gap-3 pb-3 border-b border-zinc-700/50 last:border-0 last:pb-0">
              <Avatar className="w-8 h-8">
                <AvatarImage src={item.user.avatar} alt={item.user.name} />
                <AvatarFallback>{item.user.initials}</AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex flex-wrap items-baseline gap-1">
                  <span className="text-sm font-medium text-white">{item.user.name}</span>
                  <span className="text-xs text-zinc-400">{item.action}</span>
                  <span className="text-sm font-medium text-indigo-300">{item.project}</span>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-500">{item.time}</span>
                  <Badge className={`${getStatusColor(item.status)} text-xs font-normal`}>
                    {item.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
