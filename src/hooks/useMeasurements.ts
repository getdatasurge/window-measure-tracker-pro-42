
import { useState, useEffect } from 'react';
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

  // Fetch the measurements data
  useEffect(() => {
    const fetchMeasurements = async () => {
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
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Transform the data to match our Measurement type
        const mappedMeasurements = (data || []).map(item => ({
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
          reviewComments: '',
        }));
        
        setMeasurements(mappedMeasurements);
        
        // Enable realtime subscriptions
        if (!isRealtime) {
          setupRealtimeSubscription();
        }
      } catch (err) {
        console.error('Error fetching measurements:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch measurements'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeasurements();
    
    // Cleanup function to remove subscriptions
    return () => {
      if (isRealtime) {
        supabase.removeAllChannels();
      }
    };
  }, [options.projectId, options.date, options.status, isRealtime]);
  
  // Set up realtime subscription
  const setupRealtimeSubscription = async () => {
    try {
      // Enable realtime for the measurements table first
      await setupRealtime();
      
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
            // For a production app, you might want to handle the specific change
            // rather than refetching all data
            refetchMeasurements();
          }
        )
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
        });
        
      console.log('Realtime subscription established for measurements table');
      setIsRealtime(true);

      // Return unsubscribe function
      return () => {
        console.log('Unsubscribing from realtime channel');
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Failed to set up realtime subscription:', error);
    }
  };
  
  // Function to manually refetch measurements
  const refetchMeasurements = async () => {
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
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to match our Measurement type
      const mappedMeasurements = (data || []).map(item => ({
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
        reviewComments: '',
      }));
      
      setMeasurements(mappedMeasurements);
    } catch (err) {
      console.error('Error refetching measurements:', err);
      setError(err instanceof Error ? err : new Error('Failed to refetch measurements'));
    } finally {
      setIsLoading(false);
    }
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
