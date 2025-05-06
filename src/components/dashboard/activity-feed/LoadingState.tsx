
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Displays a loading skeleton for the activity feed
 */
const LoadingState: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-zinc-800"></div>
          <div className="flex-1">
            <div className="h-4 w-3/4 bg-zinc-800 rounded mb-2"></div>
            <div className="h-3 w-1/4 bg-zinc-800/50 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
