
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Measurement } from '@/types/measurement';
import { useAuth } from '@/contexts/auth';

export function useMeasurementUpdate() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSaveMeasurement = async (measurement: Measurement, onSuccess?: () => void) => {
    try {
      setIsSaving(true);
      console.log("Processing measurement data in public mode:", measurement);
      
      // Parse numeric values to ensure they're saved as numbers
      const parseNumericValue = (value: string | undefined): number | null => {
        if (!value) return null;
        // Remove any non-numeric characters except decimal point
        const numericStr = value.replace(/[^0-9.]/g, '');
        const parsed = parseFloat(numericStr);
        return isNaN(parsed) ? null : parsed;
      };
      
      // Use the direction from measurement or default if not provided
      const direction = measurement.direction || 'N/A';
      
      console.log("Direction value:", direction);
      
      // In public read-only mode, just simulate processing the data
      setTimeout(() => {
        toast({
          title: measurement.id ? "Measurement updated" : "Measurement created",
          description: "Your changes have been processed in read-only mode.",
        });
        
        // Save last selected project to localStorage
        if (measurement.projectId && measurement.projectName) {
          localStorage.setItem('lastSelectedProject', JSON.stringify({
            id: measurement.projectId,
            name: measurement.projectName
          }));
        }
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      }, 500);
    } catch (err) {
      console.error('Error processing measurement:', err);
      toast({
        title: "Error processing measurement",
        description: err instanceof Error ? err.message : "Failed to process measurement. Please check your data and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveMeasurement: handleSaveMeasurement,
    isSaving
  };
}
