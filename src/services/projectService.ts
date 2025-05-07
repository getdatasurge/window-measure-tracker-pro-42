
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Define a simplified project interface directly here to avoid circular dependencies
interface ProjectBasicData {
  id: string;
  name: string;
  client_name?: string;
  location?: string;
  status?: string;
  deadline?: string;
}

/**
 * Fetch projects with optional filtering
 * @param activeOnly Whether to only fetch active projects
 * @returns Array of projects
 */
export const fetchProjects = async (activeOnly = true): Promise<ProjectBasicData[]> => {
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

    // Return the data with explicit type
    return (data || []) as ProjectBasicData[];
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
