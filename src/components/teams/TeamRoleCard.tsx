
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
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 sm:p-5 hover:bg-zinc-800/70 transition-colors cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <h3 className="font-medium text-xs sm:text-sm text-zinc-200">{title}</h3>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{count}</p>
          <p className="text-xs text-zinc-400">{description}</p>
        </div>
        <div 
          className="w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center" 
          style={{ backgroundColor: `${color}20` }}
        >
          <Users size={16} className="sm:hidden" style={{ color }} />
          <Users size={18} className="hidden sm:block" style={{ color }} />
        </div>
      </div>
    </div>
  );
};

export default TeamRoleCard;
