
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { TeamActivity } from './types';
import { transformActivityData } from './utils';

/**
 * Custom hook for fetching and managing activity feed data
 */
export const useActivityFeed = () => {
  const [activities, setActivities] = useState<TeamActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
          .limit(20);

        if (queryError) {
          throw queryError;
        }

        if (data) {
          // Cast to any to avoid TypeScript errors during transformation
          const transformedActivities = transformActivityData(data as any[]);
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

  return { activities, loading, error };
};
