import { useState, useEffect } from 'react';
import { Measurement } from '@/types/measurement';

const LOCAL_STORAGE_KEY = 'lastMeasurementEntry';
const EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

type StoredFormData = {
  data: Partial<Measurement>;
  timestamp: number;
};

export const useMeasurementFormStorage = (
  isOpen: boolean, 
  defaultValues?: Partial<Measurement>
) => {
  const [initialFormData, setInitialFormData] = useState<Partial<Measurement> | null>(null);

  // Load stored data when modal opens
  useEffect(() => {
    if (isOpen) {
      // If default values are provided, use those instead of localStorage
      if (defaultValues && Object.keys(defaultValues).length > 0) {
        setInitialFormData(defaultValues);
        return;
      }

      // Otherwise try to load from localStorage
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData) as StoredFormData;
            
          // Check if the saved data has expired
          const isExpired = Date.now() - parsedData.timestamp > EXPIRATION_TIME;
            
          if (!isExpired) {
            // Use the saved data if it's not expired
            setInitialFormData(parsedData.data);
          } else {
            // If the data is expired, remove it from localStorage
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            setInitialFormData(null);
          }
        } catch (error) {
          console.error('Failed to parse saved measurement data:', error);
          setInitialFormData(null);
        }
      } else {
        // No saved data
        setInitialFormData(null);
      }
    }
  }, [isOpen, defaultValues]);

  // Function to save data to localStorage
  const saveFormData = (data: Partial<Measurement>) => {
    // Save with timestamp for expiration checking
    const dataToSave = {
      data: {
        projectId: data.projectId,
        projectName: data.projectName,
        location: data.location,
        recordedBy: data.recordedBy,
        width: data.width,
        height: data.height,
        quantity: data.quantity,
        direction: data.direction,
        notes: data.notes
      },
      timestamp: Date.now()
    };
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
  };

  return { initialFormData, saveFormData };
};
