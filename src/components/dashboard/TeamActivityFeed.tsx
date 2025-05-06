
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, UserPlus, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';

interface TeamActivity {
  id: string;
  avatar?: string;
  name: string;
  action: string;
  target?: string;
  targetType?: 'project' | 'team' | 'measurement';
  timeAgo: string;
  icon: "measurement" | "team" | "complete" | "issue" | "update";
  metadata?: Record<string, any> | null;
}

const TeamActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<TeamActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Define a function to map action_type to icon type
  const mapActionTypeToIcon = (actionType: string): "measurement" | "team" | "complete" | "issue" | "update" => {
    switch (actionType?.toLowerCase()) {
      case 'add':
      case 'create':
      case 'measurement':
        return 'measurement';
      case 'assign':
      case 'team':
        return 'team';
      case 'complete':
      case 'finish':
        return 'complete';
      case 'error':
      case 'issue':
        return 'issue';
      case 'update':
      case 'change':
      case 'modify':
        return 'update';
      default:
        return 'update';
    }
  };

  // Format the timestamp in a user-friendly way
  const formatTimeDistance = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      // If less than 24 hours ago, show relative time, otherwise show the date
      const now = new Date();
      const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      return diffHours < 24
        ? formatDistanceToNow(date, { addSuffix: true })
        : format(date, 'MMM d, yyyy');
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Unknown time';
    }
  };

  // Fetch activities from Supabase
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        const { data, error: queryError } = await supabase
          .from('activities')
          .select(`
            id,
            description,
            action_type,
            performed_at,
            metadata,
            project_id,
            projects (name),
            performed_by,
            profiles (full_name, avatar_url)
          `)
          .order('performed_at', { ascending: false })
          .limit(15);

        if (queryError) {
          throw queryError;
        }

        if (data) {
          // Transform the data to match our TeamActivity interface
          const transformedActivities = data.map(item => {
            // Safely access potentially null properties
            const profileName = item.profiles?.full_name || 'Unknown User';
            const avatarUrl = item.profiles?.avatar_url || `/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png`;
            const projectName = item.projects?.name || 'Unknown Project';
            const actionType = item.action_type || 'update';
            const description = item.description || 'performed an action';
            
            // Safely handle metadata - ensure it's an object
            let metadata: Record<string, any> | null = null;
            let targetType: 'project' | 'team' | 'measurement' = 'project';
            
            if (item.metadata) {
              // If metadata is a string, try to parse it
              if (typeof item.metadata === 'string') {
                try {
                  metadata = JSON.parse(item.metadata);
                  targetType = metadata?.target_type as any || 'project';
                } catch (e) {
                  console.error('Failed to parse metadata string:', e);
                  metadata = null;
                }
              } else {
                // If it's already an object, use it directly
                metadata = item.metadata as Record<string, any>;
                targetType = (metadata?.target_type as any) || 'project';
              }
            }

            return {
              id: item.id,
              avatar: avatarUrl,
              name: profileName,
              action: description,
              target: projectName,
              targetType: targetType,
              timeAgo: formatTimeDistance(item.performed_at),
              icon: mapActionTypeToIcon(actionType),
              metadata: metadata
            };
          });

          setActivities(transformedActivities);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch activities'));
        toast({
          variant: "destructive",
          title: "Failed to load activity feed",
          description: "Please try again later or contact support if the problem persists."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

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

  // Animation variants
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

  // If loading, show a subtle loading indicator
  if (loading) {
    return <motion.div initial="hidden" animate="show" variants={container} className="bg-dark-200 rounded-xl shadow-lg p-4 h-auto border border-zinc-800/70">
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
    </motion.div>;
  }

  // If error occurred during fetch
  if (error) {
    return <div className="bg-dark-200 rounded-xl shadow-lg p-4 h-auto border border-zinc-800/70">
      <div className="flex flex-col items-center justify-center py-6">
        <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
        <p className="text-sm text-zinc-400">Failed to load activity data</p>
        <button 
          className="mt-3 text-xs text-blue-400 hover:text-blue-300"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    </div>;
  }

  // If no activities found
  if (activities.length === 0) {
    return <div className="bg-dark-200 rounded-xl shadow-lg p-4 h-auto border border-zinc-800/70">
      <div className="flex flex-col items-center justify-center py-6">
        <Calendar className="h-8 w-8 text-zinc-500 mb-2" />
        <p className="text-sm text-zinc-400">No recent activity found</p>
      </div>
    </div>;
  }

  return (
    <TooltipProvider>
      <motion.div initial="hidden" animate="show" variants={container} className="bg-dark-200 rounded-xl shadow-lg p-4 h-auto border border-zinc-800/70">
        <div className="space-y-5">
          {activities.map(activity => (
            <motion.div key={activity.id} variants={item} className="flex gap-3 group">
              <div className="shrink-0 mt-0.5">
                {getActivityIcon(activity.icon)}
              </div>
              <div className="flex-1">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full overflow-hidden border border-zinc-700/50 mr-2 shrink-0">
                    <img 
                      src={activity.avatar} 
                      alt={activity.name} 
                      className="h-full w-full object-cover" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png';
                      }}
                    />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium text-white">{activity.name}</span>{' '}
                    <span className="text-zinc-400">{activity.action}</span>{' '}
                    {activity.target && (
                      <>
                        <span className="text-zinc-400">on</span>{' '}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={getTargetStyles(activity.targetType)}>
                              {activity.target}
                              {activity.targetType === 'measurement' && ' (Measurement)'}
                            </span>
                          </TooltipTrigger>
                          {activity.metadata && (
                            <TooltipContent className="bg-zinc-900 border-zinc-700 text-white">
                              {activity.metadata.field && <p>Field: {activity.metadata.field}</p>}
                              {activity.metadata.value && <p>Value: {activity.metadata.value}</p>}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </>
                    )}
                  </p>
                </div>
                <p className="text-xs text-zinc-500 mt-1.5 ml-8">{activity.timeAgo}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default TeamActivityFeed;
