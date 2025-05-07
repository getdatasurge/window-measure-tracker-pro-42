
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Measurement } from '@/types/measurement';
import { setupRealtime } from '@/utils/setupRealtime';

interface MeasurementsQueryOptions {
  projectId?: string;
  date?: Date;
  status?: string;
}

/**
 * Hook to fetch measurements with optional filtering
 */
export const useMeasurements = (options: MeasurementsQueryOptions = {}) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRealtime, setIsRealtime] = useState<boolean>(false);
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);

  // Format a measurement from the database to our UI format
  const formatMeasurement = useCallback((item: any): Measurement => {
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
      updatedBy: item.updated_by || '',
      photos: item.photos || [],
      film_required: item.film_required,
      reviewComments: '',
    };
  }, []);

  // Function to fetch measurements with current options
  const fetchMeasurements = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Build the query based on the options
      let query = supabase
        .from('measurements')
        .select(`
          id, 
          project_id,
          location,
          width, 
          height, 
          depth, 
          area, 
          quantity,
          recorded_by,
          direction,
          notes,
          status,
          measurement_date,
          updated_at,
          updated_by,
          photos,
          film_required,
          projects (name)
        `)
        .eq('deleted', false)
        .order('updated_at', { ascending: false });
      
      // Add filters based on options
      if (options.projectId) {
        query = query.eq('project_id', options.projectId);
      }
      
      if (options.date) {
        const startDate = new Date(options.date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(options.date);
        endDate.setHours(23, 59, 59, 999);
        
        query = query
          .gte('measurement_date', startDate.toISOString())
          .lt('measurement_date', endDate.toISOString());
      }
      
      if (options.status) {
        query = query.eq('status', options.status.toLowerCase());
      }
      
      // Execute query
      console.log("Executing measurements query with options:", options);
      const { data, error } = await query;
      
      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} measurements`);
      
      // Transform the data to match our Measurement type
      const mappedMeasurements = (data || []).map(formatMeasurement);
      
      setMeasurements(mappedMeasurements);
      setError(null);
      
      // Enable realtime subscriptions if not already set up
      if (!isRealtime) {
        setupRealtimeSubscription();
      }
    } catch (err) {
      console.error('Error fetching measurements:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch measurements'));
    } finally {
      setIsLoading(false);
    }
  }, [options, formatMeasurement, isRealtime]);
  
  // Fetch the measurements data on mount and when options change
  useEffect(() => {
    fetchMeasurements();
    
    // Cleanup function to remove subscriptions
    return () => {
      if (realtimeChannel) {
        console.log("Cleaning up realtime subscription");
        supabase.removeChannel(realtimeChannel);
        setRealtimeChannel(null);
        setIsRealtime(false);
      }
    };
  }, [options.projectId, options.date, options.status, fetchMeasurements]);
  
  // Set up realtime subscription
  const setupRealtimeSubscription = async () => {
    try {
      console.log("Setting up realtime subscription for measurements");
      // Enable realtime for the measurements table first
      const realtimeStatus = await setupRealtime();
      
      if (!realtimeStatus) {
        console.warn("Failed to enable realtime for measurements table");
        return;
      }
      
      // Subscribe to changes
      const channel = supabase
        .channel('measurements_changes')
        .on('postgres_changes', 
          {
            event: '*', 
            schema: 'public',
            table: 'measurements'
          }, 
          (payload) => {
            console.log('Real-time update received:', payload);
            
            // Refresh the data when changes occur
            fetchMeasurements();
          }
        )
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
        });
      
      setRealtimeChannel(channel);  
      console.log('Realtime subscription established for measurements table');
      setIsRealtime(true);
    } catch (error) {
      console.error('Failed to set up realtime subscription:', error);
    }
  };
  
  // Expose refetchMeasurements for manual data refreshing
  const refetchMeasurements = async () => {
    console.log("Manually refetching measurements");
    return fetchMeasurements();
  };
  
  return {
    measurements,
    isLoading,
    error,
    refetchMeasurements
  };
};

/**
 * Enable real-time on the measurements table in Supabase
 */
export const enableMeasurementsRealtime = async () => {
  try {
    // Use the updated setupRealtime utility 
    const success = await setupRealtime();
    return success;
  } catch (error) {
    console.error('Failed to enable real-time:', error);
    return false;
  }
};
