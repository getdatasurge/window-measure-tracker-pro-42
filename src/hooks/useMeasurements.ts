
import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Measurement } from '@/types/measurement';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

export const MEASUREMENTS_QUERY_KEY = 'measurements';

// Define filter types
export interface MeasurementFilters {
  projectId?: string | null;
  location?: string | null;
  status?: string | null;
  dateRange?: { 
    from: Date | null; 
    to: Date | null 
  } | null;
  includeDeleted?: boolean;
}

/**
 * Hook for fetching and managing measurements data
 */
export const useMeasurements = (filters: MeasurementFilters = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Function to fetch measurements from Supabase
  const fetchMeasurements = useCallback(async () => {
    if (!user) return [];
    
    try {
      let query = supabase
        .from('measurements')
        .select(`
          *,
          projects:project_id (name)
        `)
        .order('updated_at', { ascending: false });
      
      // Apply filters if provided
      if (!filters.includeDeleted) {
        query = query.eq('deleted', false);
      }
      
      if (filters.projectId) {
        query = query.eq('project_id', filters.projectId);
      }
      
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status.toLowerCase());
      }
      
      if (filters.dateRange?.from && filters.dateRange?.to) {
        query = query
          .gte('measurement_date', filters.dateRange.from.toISOString())
          .lte('measurement_date', filters.dateRange.to.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process the data to match our frontend schema
      return data.map(item => ({
        id: item.id,
        projectId: item.project_id,
        projectName: item.projects?.name || 'Unknown Project',
        location: item.location || '',
        width: typeof item.width === 'number' ? `${item.width}"` : (item.width || '0"'),
        height: typeof item.height === 'number' ? `${item.height}"` : (item.height || '0"'),
        depth: item.depth ? `${item.depth}"` : undefined,
        area: item.area ? `${item.area} ft²` : '0 ft²',
        quantity: item.quantity || 1,
        recordedBy: item.recorded_by || '',
        direction: (item.direction || 'N/A') as any,
        notes: item.notes,
        status: (item.status || 'Pending') as any,
        measurementDate: item.measurement_date || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
        updatedBy: item.updated_by,
        photos: item.photos || [],
      }));
    } catch (err) {
      console.error('Error fetching measurements:', err);
      toast({
        title: "Error",
        description: "Failed to load measurements. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  }, [user, filters, toast]);

  // Main query for measurements
  const query = useQuery({
    queryKey: [MEASUREMENTS_QUERY_KEY, filters],
    queryFn: fetchMeasurements,
    enabled: !!user,
  });
  
  // Function to invalidate measurements queries and force a refetch
  const invalidateMeasurements = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [MEASUREMENTS_QUERY_KEY] });
  }, [queryClient]);

  // Function to add a new measurement to the cache
  const addMeasurementToCache = useCallback((newMeasurement: Measurement) => {
    queryClient.setQueryData([MEASUREMENTS_QUERY_KEY], (oldData: any) => {
      if (Array.isArray(oldData)) {
        return [newMeasurement, ...oldData];
      }
      return oldData;
    });
  }, [queryClient]);

  return {
    measurements: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    invalidateMeasurements,
    addMeasurementToCache
  };
};

// Setup Supabase realtime subscription
export const setupMeasurementsSubscription = (queryClient: any) => {
  const channel = supabase
    .channel('public:measurements')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'measurements' }, 
      () => {
        // Invalidate and refetch measurements when data changes
        queryClient.invalidateQueries({ queryKey: [MEASUREMENTS_QUERY_KEY] });
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
};
