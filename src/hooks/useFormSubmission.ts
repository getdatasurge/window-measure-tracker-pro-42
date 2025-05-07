
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

// Define interfaces for your form submission state and handlers
export interface FormSubmissionState {
  isSubmitting: boolean;
}

export interface FormSubmissionHandlers {
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmission: (
    data: any,
    photoUrls: string[],
    onSuccess?: () => void,
    measurementId?: string
  ) => Promise<any>;
}

export function useFormSubmission(): FormSubmissionState & FormSubmissionHandlers {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSubmission = async (
    data: any,
    photoUrls: string[],
    onSuccess?: () => void,
    measurementId?: string
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
      
      // Calculate area if width and height are provided
      let area = null;
      if (width && height) {
        area = (width * height) / 144; // Convert to square feet (from inches)
      }
      
      // Ensure we use a valid direction value that matches the database constraint
      const direction = data.direction || 'N/A'; // Default to N/A if not provided

      console.log("Direction being sent to database:", direction);

      // Prepare data for database submission
      const measurementData: any = {
        project_id: data.projectId,
        location: data.location.trim(),
        width,
        height,
        area,
        quantity: data.quantity || 1,
        recorded_by: user.id,
        direction,
        notes: data.notes || '',
        status: data.status?.toLowerCase() || 'pending',
        measurement_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: user.id,
        film_required: data.filmRequired,
        photos: photoUrls
        // Removed the input_source field as it doesn't exist in the database
      };
      
      // Only add installation_date if status is 'installed'
      if (data.status?.toLowerCase() === 'installed' && data.installationDate) {
        measurementData.installation_date = data.installationDate;
      }
      
      console.log("Measurement data being submitted:", measurementData);
      
      let result;
      
      // Save to supabase - either create or update
      if (measurementId) {
        // Update existing measurement
        const { data: updatedData, error } = await supabase
          .from('measurements')
          .update(measurementData)
          .eq('id', measurementId)
          .select();
          
        if (error) {
          console.error("Error updating measurement:", error);
          throw error;
        }
        
        console.log("Measurement updated:", updatedData);
        result = updatedData;
        
        toast({
          title: "Measurement updated successfully",
          description: "The measurement has been successfully updated.",
          duration: 3000,
        });
      } else {
        // Create new measurement
        const { data: insertedData, error } = await supabase
          .from('measurements')
          .insert(measurementData)
          .select();
          
        if (error) {
          console.error("Error inserting measurement:", error);
          throw error;
        }
        
        console.log("Measurement created:", insertedData);
        result = insertedData;
        
        toast({
          title: "Measurement submitted successfully",
          description: "The measurement has been successfully created.",
          duration: 3000,
        });
      }
      
      // Save last selected project to localStorage
      localStorage.setItem('lastSelectedProject', JSON.stringify({
        id: data.projectId,
        name: data.projectName
      }));
      
      // Call success callback if provided
      if (onSuccess) {
        // Execute onSuccess as a separate step AFTER the database operation completes
        await onSuccess();
      }
      
      return result;
      
    } catch (err) {
      console.error('Error saving measurement:', err);
      toast({
        title: "Error saving measurement",
        description: err instanceof Error ? err.message : "Failed to save measurement. Please check your data and try again.",
        variant: "destructive",
        duration: 5000,
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
