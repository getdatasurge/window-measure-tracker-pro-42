import React from 'react';
import { motion } from 'framer-motion';
import { FileText, UserPlus, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
interface TeamActivity {
  id: number;
  avatar: string;
  name: string;
  action: string;
  target?: string;
  targetType?: 'project' | 'team' | 'measurement';
  timeAgo: string;
  icon: "measurement" | "team" | "complete" | "issue" | "update";
}
const TeamActivityFeed: React.FC = () => {
  const activities: TeamActivity[] = [{
    id: 1,
    avatar: '/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png',
    name: 'John Smith',
    action: 'added 12 measurements to',
    target: 'Downtown Office Tower',
    targetType: 'project',
    timeAgo: '2 hours ago',
    icon: 'measurement'
  }, {
    id: 2,
    avatar: '/lovable-uploads/75ba837b-8924-4c3d-a163-ab9116a7c9fb.png',
    name: 'Sarah Johnson',
    action: 'created a new project',
    target: 'Greenview Mall',
    targetType: 'project',
    timeAgo: '5 hours ago',
    icon: 'project' as any // Using type assertion for backward compatibility
  }, {
    id: 3,
    avatar: '/lovable-uploads/1147f83d-d82c-4ab7-a3de-51400ce914c1.png',
    name: 'Mike Davis',
    action: 'completed all measurements for',
    target: 'Riverside Apartments',
    targetType: 'project',
    timeAgo: 'Yesterday',
    icon: 'complete'
  }, {
    id: 4,
    avatar: '/lovable-uploads/211d8c12-4057-4c0f-80e4-5191abc30c81.png',
    name: 'Lisa Chen',
    action: 'updated the deadline for',
    target: 'Lakeside Hotel',
    targetType: 'project',
    timeAgo: '2 days ago',
    icon: 'update' as any // Using type assertion for backward compatibility
  }, {
    id: 5,
    avatar: '/lovable-uploads/ba4d7a6f-6bb7-4c0a-a30b-19d87ec003f2.png',
    name: 'Tom Wilson',
    action: 'joined the team',
    timeAgo: '1 week ago',
    icon: 'team'
  }];
  const getActivityIcon = (icon: "measurement" | "team" | "complete" | "issue" | "update" | string) => {
    switch (icon) {
      case 'measurement':
        return <div className="p-2 rounded-full bg-blue-900/30 text-blue-400"><FileText size={16} /></div>;
      case 'team':
        return <div className="p-2 rounded-full bg-purple-900/30 text-purple-400"><UserPlus size={16} /></div>;
      case 'complete':
        return <div className="p-2 rounded-full bg-green-900/30 text-green-400"><CheckCircle size={16} /></div>;
      case 'issue':
        return <div className="p-2 rounded-full bg-red-900/30 text-red-400"><AlertCircle size={16} /></div>;
      case 'update':
        return <div className="p-2 rounded-full bg-amber-900/30 text-amber-400"><Calendar size={16} /></div>;
      default:
        return <div className="p-2 rounded-full bg-gray-900/30 text-gray-400"><FileText size={16} /></div>;
    }
  };
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
  const container = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const item = {
    hidden: {
      opacity: 0,
      y: 10
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };
  return <motion.div initial="hidden" animate="show" variants={container} className="bg-[#1a1a1a] rounded-xl shadow-lg p-4 h-auto border border-zinc-800/70">
      <div className="space-y-5">
        {activities.map(activity => <motion.div key={activity.id} variants={item} className="flex gap-3 group">
            <div className="shrink-0 mt-0.5">
              {getActivityIcon(activity.icon)}
            </div>
            <div className="flex-1">
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full overflow-hidden border border-zinc-700/50 mr-2 shrink-0">
                  <img src={activity.avatar} alt={activity.name} className="h-full w-full object-cover" />
                </div>
                <p className="text-sm">
                  <span className="font-medium text-white">{activity.name}</span>{' '}
                  <span className="text-zinc-400">{activity.action}</span>{' '}
                  {activity.target && <span className={getTargetStyles(activity.targetType)}>
                      {activity.target}
                    </span>}
                </p>
              </div>
              <p className="text-xs text-zinc-500 mt-1.5 ml-8">{activity.timeAgo}</p>
            </div>
          </motion.div>)}
      </div>
    </motion.div>;
};
export default TeamActivityFeed;