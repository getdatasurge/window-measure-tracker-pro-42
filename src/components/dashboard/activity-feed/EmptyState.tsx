
import React from 'react';
import { Calendar } from 'lucide-react';

/**
 * Displays a message when there are no activities to show
 */
const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <Calendar className="h-8 w-8 text-zinc-500 mb-2" />
      <p className="text-sm text-zinc-400">No recent activity found</p>
    </div>
  );
};

export default EmptyState;
