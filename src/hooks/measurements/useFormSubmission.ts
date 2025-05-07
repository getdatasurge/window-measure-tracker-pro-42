
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { MeasurementFormData, FormSubmissionState, FormSubmissionHandlers } from './types';
import { Direction } from '@/types/measurement';

export function useFormSubmission(): FormSubmissionState & FormSubmissionHandlers {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSubmission = async (
    data: MeasurementFormData,
    photoUrls: string[],
    onSuccess?: () => void
  ): Promise<any> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to save measurements.",
        variant: "destructive"
      });
      return;
    }
    
    if (!data.projectId) {
      toast({
        title: "Project required",
        description: "Please select a project for this measurement.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Parse numeric values to ensure they're saved as numbers
      const parseNumericValue = (value: string | undefined): number | null => {
        if (!value) return null;
        const numericStr = value.replace(/[^0-9.]/g, '');
        const parsed = parseFloat(numericStr);
        return isNaN(parsed) ? null : parsed;
      };
      
      const width = parseNumericValue(data.width);
      const height = parseNumericValue(data.height);
      const depth = parseNumericValue(data.depth);
      
      // Calculate area if width and height are provided
      let area = null;
      if (width && height) {
        area = (width * height) / 144; // Convert to square feet (from inches)
      }
      
      // Ensure direction is properly typed
      let direction: Direction | string = 'N/A';
      if (data.direction) {
        direction = data.direction as Direction;
      }

      // Prepare data for database submission
      const measurementData = {
        project_id: data.projectId,
        location: data.location.trim(),
        width,
        height,
        depth,
        area,
        quantity: data.quantity || 1,
        recorded_by: user.id,
        direction: (direction || 'N/A').toLowerCase(),
        notes: data.notes || '',
        status: 'pending',
        measurement_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: user.id,
        film_required: data.filmRequired,
        photos: photoUrls
      };
      
      // Save to supabase
      const { data: insertedData, error } = await supabase
        .from('measurements')
        .insert(measurementData)
        .select();
        
      if (error) {
        throw error;
      }
      
      // Save last selected project to localStorage
      localStorage.setItem('lastSelectedProject', JSON.stringify({
        id: data.projectId,
        name: data.projectName
      }));
      
      // Show success message
      toast({
        title: "Measurement submitted successfully",
        description: "The measurement has been successfully created.",
        duration: 5000, // Auto dismiss after 5 seconds
      });
      
      // Call success callback if provided
      if (onSuccess) {
        // Execute onSuccess as a separate step AFTER the database operation completes
        await onSuccess();
      }
      
      return insertedData;
      
    } catch (err) {
      console.error('Error saving measurement:', err);
      toast({
        title: "Error saving measurement",
        description: err instanceof Error ? err.message : "Failed to save measurement. Please check your data and try again.",
        variant: "destructive",
        duration: 5000, // Auto dismiss after 5 seconds
      });
      throw err;
    }
  };

  return {
    isSubmitting,
    setIsSubmitting,
    handleSubmission
  };
}
