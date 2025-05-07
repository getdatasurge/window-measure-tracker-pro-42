
import { useState, useEffect, useCallback } from 'react';
import { Measurement } from '@/types/measurement';
import { MeasurementFormData } from './measurements/types';

const LOCAL_STORAGE_KEY = 'lastMeasurementEntry';
const EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

type StoredFormData = {
  data: Partial<Measurement> | MeasurementFormData;
  timestamp: number;
};

export const useMeasurementFormStorage = (isOpen?: boolean, defaultValues?: Partial<Measurement>) => {
  const [initialFormData, setInitialFormData] = useState<Partial<Measurement> | MeasurementFormData | null>(null);

  // Load stored data when hook initializes
  useEffect(() => {
    // Try to load from localStorage
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
  }, []);

  // Function to save data to localStorage
  const saveFormData = useCallback((data: Partial<Measurement> | MeasurementFormData) => {
    // Don't save empty data
    if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
      return;
    }
    
    // Save with timestamp for expiration checking
    const dataToSave = {
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
  }, []);
  
  // Function to clear saved form data
  const clearSavedForm = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setInitialFormData(null);
  }, []);

  return { 
    initialFormData, 
    saveFormData,
    clearSavedForm
  };
};
