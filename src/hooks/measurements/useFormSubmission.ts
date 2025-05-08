
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { MeasurementFormData, FormSubmissionState, FormSubmissionHandlers } from './types';

export function useFormSubmission(): FormSubmissionState & FormSubmissionHandlers {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSubmission = async (
    data: MeasurementFormData,
    photoUrls: string[],
    onSuccess?: () => void,
    measurementId?: string
  ): Promise<any> => {
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
      
      // Ensure we use a valid direction value
      const direction = data.direction || 'N/A'; // Default to N/A if not provided

      console.log("Direction being sent:", direction);

      // Prepare data for submission
      const measurementData: any = {
        project_id: data.projectId || 'mock-project',
        location: data.location.trim(),
        width,
        height,
        area,
        quantity: data.quantity || 1,
        recorded_by: user?.id || 'mock-user',
        direction,
        notes: data.notes || '',
        status: data.status?.toLowerCase() || 'pending',
        measurement_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: user?.id || 'mock-user',
        film_required: data.filmRequired,
        photos: photoUrls,
        input_source: data.input_source || 'manual'
      };
      
      // Only add installation_date if status is 'installed'
      if (data.status?.toLowerCase() === 'installed' && data.installationDate) {
        measurementData.installation_date = data.installationDate;
      }
      
      console.log("Measurement data being submitted:", measurementData);
      
      // Mock implementation - data is temporary and not stored
      toast({
        title: "Measurement processed",
        description: "Your measurement has been processed in mock mode.",
        duration: 3000,
      });
      
      // Save last selected project to localStorage
      localStorage.setItem('lastSelectedProject', JSON.stringify({
        id: data.projectId || 'mock-project',
        name: data.projectName || 'Mock Project'
      }));
      
      // Call success callback if provided
      if (onSuccess) {
        // Execute onSuccess as a separate step
        await onSuccess();
      }
      
      return { id: 'temp-' + Date.now(), ...measurementData };
      
    } catch (err) {
      console.error('Error processing measurement:', err);
      toast({
        title: "Error processing measurement",
        description: err instanceof Error ? err.message : "Failed to process measurement. Please check your data and try again.",
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
