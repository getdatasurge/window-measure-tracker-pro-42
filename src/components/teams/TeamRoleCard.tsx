
import React from 'react';
import { Users } from 'lucide-react';

interface TeamRoleCardProps {
  title: string;
  count: number;
  description: string;
  color?: string;
}

const TeamRoleCard: React.FC<TeamRoleCardProps> = ({ 
  title, 
  count, 
  description,
  color = "#8B5CF6" // Default to purple
}) => {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-5 hover:bg-zinc-800/70 transition-colors cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <h3 className="font-medium text-sm text-zinc-200">{title}</h3>
          </div>
          <p className="text-2xl font-bold text-white">{count}</p>
          <p className="text-xs text-zinc-400">{description}</p>
        </div>
        <div 
          className="w-10 h-10 rounded flex items-center justify-center" 
          style={{ backgroundColor: `${color}20` }}
        >
          <Users size={18} style={{ color }} />
        </div>
      </div>
    </div>
  );
};

export default TeamRoleCard;
