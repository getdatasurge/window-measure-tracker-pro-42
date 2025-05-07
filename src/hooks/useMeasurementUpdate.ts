
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Measurement } from '@/types/measurement';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { DEFAULT_DIRECTION } from '@/constants/direction';

export function useMeasurementUpdate() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSaveMeasurement = async (measurement: Measurement, onSuccess?: () => void) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to save measurements.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSaving(true);
      console.log("Preparing measurement data for save:", measurement);
      
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
      
      console.log("Direction being sent to database:", direction);
      
      // Prepare data for database (converting to match DB schema)
      const measurementData = {
        project_id: measurement.projectId,
        location: measurement.location.trim(),
        width: parseNumericValue(measurement.width),
        height: parseNumericValue(measurement.height),
        area: parseNumericValue(measurement.area),
        quantity: measurement.quantity || 1,
        recorded_by: user.id,
        direction, // Use the validated direction value
        notes: measurement.notes || '',
        status: measurement.status.toLowerCase(),
        measurement_date: measurement.measurementDate || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: user.id,
        photos: Array.isArray(measurement.photos) ? measurement.photos : [],
        film_required: measurement.film_required === undefined ? true : !!measurement.film_required,
      };
      
      // Only include installation date if status is 'installed'
      if (measurement.status?.toLowerCase() === 'installed' && measurement.installationDate) {
        measurementData.installation_date = measurement.installationDate;
      }
      
      // Validate required fields
      const requiredFields = ['project_id', 'location', 'width', 'height'];
      const missingFields = requiredFields.filter(field => !measurementData[field]);
      
      if (missingFields.length > 0) {
        const fieldNames = missingFields.map(f => f.replace('_', ' ')).join(', ');
        throw new Error(`Required fields missing: ${fieldNames}`);
      }
      
      console.log("Formatted measurement data:", measurementData);
      
      let result;
      
      if (measurement.id) {
        console.log("Updating existing measurement with ID:", measurement.id);
        // Update existing measurement
        const { data, error } = await supabase
          .from('measurements')
          .update(measurementData)
          .eq('id', measurement.id)
          .select();
          
        if (error) {
          console.error("Supabase update error:", error);
          throw error;
        }
        
        console.log("Update successful:", data);
        result = data;
        
        toast({
          title: "Measurement updated",
          description: "The measurement has been successfully updated."
        });
      } else {
        console.log("Creating new measurement");
        // Create new measurement
        const { data, error } = await supabase
          .from('measurements')
          .insert(measurementData)
          .select();
          
        if (error) {
          console.error("Supabase insert error:", error);
          throw error;
        }
        
        console.log("Insert successful:", data);
        result = data;
        
        toast({
          title: "Measurement created",
          description: "The measurement has been successfully created."
        });
      }
      
      // Save last selected project to localStorage
      if (measurement.projectId && measurement.projectName) {
        localStorage.setItem('lastSelectedProject', JSON.stringify({
          id: measurement.projectId,
          name: measurement.projectName
        }));
      }
      
      // Call success callback if provided
      if (onSuccess) {
        // Execute onSuccess as a separate step AFTER the database operation completes
        await onSuccess();
      }
      
    } catch (err) {
      console.error('Error saving measurement:', err);
      toast({
        title: "Error saving measurement",
        description: err instanceof Error ? err.message : "Failed to save measurement. Please check your data and try again.",
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
