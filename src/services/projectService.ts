
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ProjectOption } from '@/types/project-types';

/**
 * Fetch projects with optional filtering
 * @param activeOnly Whether to only fetch active projects
 * @returns Array of projects
 */
export const fetchProjects = async (activeOnly = true): Promise<ProjectOption[]> => {
  try {
    let query = supabase
      .from('projects')
      .select('id, name, client_name, location, status, deadline');

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }

    // Use explicit type annotation to avoid excessive type instantiation
    return (data || []) as ProjectOption[];
  } catch (error) {
    console.error('Exception fetching projects:', error);
    toast({
      title: 'Error loading projects',
      description: 'Failed to load projects. Please try again later.',
      variant: 'destructive'
    });
    return [];
  }
};
