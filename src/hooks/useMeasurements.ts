
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Measurement } from '@/types/measurement';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

// Query keys for measurements
export const measurementKeys = {
  all: ['measurements'] as const,
  lists: () => [...measurementKeys.all, 'list'] as const,
  list: (filters: any) => [...measurementKeys.lists(), filters] as const,
  byStatus: (status: string) => [...measurementKeys.lists(), { status }] as const,
  byProject: (projectId: string) => [...measurementKeys.lists(), { projectId }] as const,
  byDay: (date: Date) => [...measurementKeys.lists(), { date: date.toISOString() }] as const,
  details: () => [...measurementKeys.all, 'detail'] as const,
  detail: (id: string) => [...measurementKeys.details(), id] as const,
};

type MeasurementFilter = {
  projectId?: string | null;
  status?: string | null;
  date?: Date | null;
  search?: string | null;
  includeDeleted?: boolean;
}

const processMeasurement = (item: any): Measurement => {
  return {
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
    notes: item.notes || '',
    status: (item.status || 'Pending') as any,
    measurementDate: item.measurement_date || new Date().toISOString(),
    updatedAt: item.updated_at || new Date().toISOString(),
    updatedBy: item.updated_by,
    photos: item.photos || [],
  };
};

/**
 * Hook to fetch and subscribe to measurements with real-time updates
 */
export const useMeasurements = (filters: MeasurementFilter = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Build the query key based on filters
  const queryKey = filters.projectId 
    ? measurementKeys.byProject(filters.projectId)
    : filters.status 
      ? measurementKeys.byStatus(filters.status)
      : filters.date 
        ? measurementKeys.byDay(filters.date)
        : measurementKeys.lists();

  // Main query function
  const fetchMeasurements = async (): Promise<Measurement[]> => {
    let query = supabase
      .from('measurements')
      .select(`
        *,
        projects:project_id (name)
      `);

    // Apply filters
    if (filters.projectId) {
      query = query.eq('project_id', filters.projectId);
    }

    if (filters.status) {
      query = query.eq('status', filters.status.toLowerCase());
    }

    if (filters.date) {
      const startDate = new Date(filters.date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(filters.date);
      endDate.setHours(23, 59, 59, 999);
      
      query = query
        .gte('measurement_date', startDate.toISOString())
        .lt('measurement_date', endDate.toISOString());
    }

    if (!filters.includeDeleted) {
      query = query.eq('deleted', false);
    }

    // Execute query and handle results
    const { data, error } = await query.order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    if (!data) return [];
    
    // Process data to match our Measurement type
    return data.map(processMeasurement);
  };

  // Set up the query
  const queryResult = useQuery({
    queryKey,
    queryFn: fetchMeasurements,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (isSubscribed) return;

    const channel = supabase
      .channel('public:measurements')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'measurements' }, 
        (payload) => {
          console.log('New measurement inserted:', payload);
          
          // Process the new measurement
          const rawMeasurement = payload.new;
          
          // Get project name (this is a limitation as real-time doesn't give us joined data)
          supabase
            .from('projects')
            .select('name')
            .eq('id', rawMeasurement.project_id)
            .single()
            .then(({ data }) => {
              const projectName = data?.name || 'Unknown Project';
              
              // Add the measurement to the cache
              queryClient.setQueryData(
                measurementKeys.lists(),
                (oldData: Measurement[] = []) => {
                  // Create a proper measurement object
                  const newMeasurement = {
                    ...processMeasurement({
                      ...rawMeasurement,
                      projects: { name: projectName }
                    }),
                  };
                  
                  // Add it to the beginning of the array
                  return [newMeasurement, ...oldData];
                }
              );
              
              // Show toast notification
              toast({
                title: "New measurement added",
                description: `${rawMeasurement.location} for ${projectName}`
              });
            });
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'measurements' }, 
        (payload) => {
          console.log('Measurement updated:', payload);
          
          const updatedMeasurement = payload.new;
          
          // Update all queries that might contain this measurement
          queryClient.invalidateQueries({ 
            queryKey: measurementKeys.all 
          });
          
          // Show toast for status changes
          if (payload.old.status !== updatedMeasurement.status) {
            toast({
              title: "Measurement status updated",
              description: `${updatedMeasurement.location} is now ${updatedMeasurement.status}`
            });
          }
        }
      )
      .on('postgres_changes', 
        { event: 'DELETE', schema: 'public', table: 'measurements' }, 
        (payload) => {
          console.log('Measurement deleted:', payload);
          
          const deletedMeasurement = payload.old;
          
          // Remove the measurement from all queries
          queryClient.setQueryData(
            measurementKeys.lists(),
            (oldData: Measurement[] = []) => {
              return oldData.filter(measurement => measurement.id !== deletedMeasurement.id);
            }
          );
          
          // Invalidate queries to ensure everything is up to date
          queryClient.invalidateQueries({ 
            queryKey: measurementKeys.all 
          });
          
          // Show toast
          toast({
            title: "Measurement deleted",
            description: `${deletedMeasurement.location} has been removed`,
            variant: "destructive"
          });
        }
      )
      .subscribe();
      
    setIsSubscribed(true);
      
    return () => {
      // Clean up subscription
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [queryClient, toast, isSubscribed]);

  return {
    ...queryResult,
    measurements: queryResult.data || [],
  };
};

/**
 * Hook to fetch a single measurement by ID with real-time updates
 */
export const useMeasurement = (id?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchMeasurement = async (): Promise<Measurement | null> => {
    if (!id) return null;
    
    const { data, error } = await supabase
      .from('measurements')
      .select(`
        *,
        projects:project_id (name)
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    if (!data) return null;
    
    return processMeasurement(data);
  };

  const queryResult = useQuery({
    queryKey: measurementKeys.detail(id || 'unknown'),
    queryFn: fetchMeasurement,
    enabled: !!id,
  });

  // Subscribe to changes for this specific measurement
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`measurement-${id}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'measurements', filter: `id=eq.${id}` }, 
        (payload) => {
          // Invalidate this measurement query
          queryClient.invalidateQueries({ 
            queryKey: measurementKeys.detail(id) 
          });
          
          if (payload.eventType === 'UPDATE') {
            toast({
              title: "Measurement updated",
              description: `${payload.new.location || 'Measurement'} has been updated`
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: "Measurement removed",
              description: `${payload.old.location || 'Measurement'} has been deleted`,
              variant: "destructive"
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient, toast]);

  return {
    ...queryResult,
    measurement: queryResult.data,
  };
};

/**
 * Enable real-time on the measurements table in Supabase
 */
export const enableMeasurementsRealtime = async () => {
  try {
    // Enable REPLICA IDENTITY FULL on measurements table for comprehensive change tracking
    await supabase.rpc('enable_realtime', {
      table_name: 'measurements'
    });
    return true;
  } catch (error) {
    console.error('Failed to enable real-time:', error);
    return false;
  }
};
