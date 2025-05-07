
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabaseClient, handleSupabaseError } from './supabaseClient';
import { Measurement } from '@/types/measurement';

// Define the response shapes
interface MeasurementsResponse {
  data: Measurement[];
  error: string | null;
}

// Create the API slice using RTK Query
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Measurements', 'Projects'],
  endpoints: (builder) => ({
    getMeasurements: builder.query<MeasurementsResponse, void>({
      queryFn: async () => {
        console.log('Fetching measurements from Supabase');
        try {
          // Notice we're not using deleted=eq.false filter because it seems this column might not exist
          // Instead we'll filter on the frontend if needed
          const { data, error } = await supabaseClient
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
              film_required,
              photos,
              projects (name)
            `)
            .order('updated_at', { ascending: false });
          
          if (error) {
            console.error('Error fetching measurements:', error);
            return { 
              error: handleSupabaseError(error)
            };
          }
          
          // Map the data to match our Measurement type
          const formattedData = data?.map(item => ({
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
            photos: Array.isArray(item.photos) ? item.photos : [],
            measurementDate: item.measurement_date || new Date().toISOString(),
            updatedAt: item.updated_at || new Date().toISOString(),
            updatedBy: item.updated_by,
            film_required: item.film_required
          })) || [];
          
          console.log(`Successfully fetched ${formattedData.length} measurements`);
          return { 
            data: {
              data: formattedData,
              error: null
            } 
          };
        } catch (err) {
          console.error('Unexpected error in getMeasurements:', err);
          return { 
            error: err instanceof Error ? err.message : 'An unknown error occurred'
          };
        }
      }
    }),
    
    // Similar pattern for projects
    getProjects: builder.query({
      queryFn: async () => {
        console.log('Fetching projects from Supabase');
        try {
          const { data, error } = await supabaseClient
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) {
            console.error('Error fetching projects:', error);
            return { 
              error: handleSupabaseError(error)
            };
          }
          
          console.log(`Successfully fetched ${data?.length || 0} projects`);
          return { data: { data, error: null } };
        } catch (err) {
          console.error('Unexpected error in getProjects:', err);
          return { 
            error: err instanceof Error ? err.message : 'An unknown error occurred'
          };
        }
      }
    })
  })
});

// Export hooks for usage in components
export const {
  useGetMeasurementsQuery,
  useGetProjectsQuery
} = apiSlice;
