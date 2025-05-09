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
    let isMounted = true;

    // Helper function to fetch a single new activity by ID
    const fetchNewActivity = async (activityId: string) => {
      try {
        const { data, error } = await supabase
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
          .eq('id', activityId)
          .single();

        if (error) throw error;

        if (data && isMounted) {
          const newActivity = transformActivityData([data as any])[0];
          setActivities(prev => [newActivity, ...prev]);
        }
      } catch (err) {
        console.error('Error fetching new activity:', err);
      }
    };

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
          .limit(20)
          .order('performed_at', { ascending: false });

        if (queryError) {
          throw queryError;
        }

        if (data && isMounted) {
          const transformed = transformActivityData(data as any[]);
          setActivities(transformed);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch activities'));
          toast({
            variant: "destructive",
            title: "Failed to load activity feed",
            description: "Please try again later or contact support if the problem persists."
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchActivities();

    const channel = supabase
      .channel('public:activities')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'activities'
      }, payload => {
        console.log('New activity received:', payload);
        fetchNewActivity(payload.new.id);
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { activities, loading, error };
};
