
import React from 'react';
import { motion } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import ActivityItem from './ActivityItem';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import { useActivityFeed } from './useActivityFeed';
import { TeamActivity } from './types';

/**
 * Main component that renders the team activity feed
 */
const TeamActivityFeed: React.FC = () => {
  const { activities, loading, error } = useActivityFeed();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // If loading, show a subtle loading indicator
  if (loading) {
    return (
      <motion.div 
        initial="hidden" 
        animate="show" 
        variants={container} 
        className="bg-dark-200 rounded-xl shadow-lg p-4 h-auto border border-zinc-800/70"
      >
        <LoadingState />
      </motion.div>
    );
  }

  // If error occurred during fetch
  if (error) {
    return (
      <div className="bg-dark-200 rounded-xl shadow-lg p-4 h-auto border border-zinc-800/70">
        <ErrorState />
      </div>
    );
  }

  // If no activities found
  if (activities.length === 0) {
    return (
      <div className="bg-dark-200 rounded-xl shadow-lg p-4 h-auto border border-zinc-800/70">
        <EmptyState />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div 
        initial="hidden" 
        animate="show" 
        variants={container} 
        className="bg-dark-200 rounded-xl shadow-lg p-4 h-auto border border-zinc-800/70"
      >
        <div className="space-y-5">
          {activities.map(activity => (
            <motion.div key={activity.id} variants={item}>
              <ActivityItem activity={activity} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default TeamActivityFeed;
