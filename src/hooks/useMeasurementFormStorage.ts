
import { useState, useEffect, useCallback } from 'react';
import { MeasurementFormData } from './measurements/types';

const LOCAL_STORAGE_KEY = 'lastMeasurementEntry';
const EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

interface StoredFormData {
  data: MeasurementFormData;
  timestamp: number;
}

/**
 * Hook for managing measurement form data persistence in localStorage
 * Handles saving, loading, and expiration of form drafts
 */
export const useMeasurementFormStorage = () => {
  const [initialFormData, setInitialFormData] = useState<MeasurementFormData | null>(null);
  const [hasSavedData, setHasSavedData] = useState<boolean>(false);

  // Load stored data when hook initializes
  useEffect(() => {
    loadSavedFormData();
  }, []);

  // Function to load data from localStorage
  const loadSavedFormData = useCallback(() => {
    try {
      // Try to load from localStorage
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      
      if (!savedData) {
        setInitialFormData(null);
        setHasSavedData(false);
        return;
      }
      
      const parsedData = JSON.parse(savedData) as StoredFormData;
      
      // Check if the saved data has expired
      const isExpired = Date.now() - parsedData.timestamp > EXPIRATION_TIME;
      
      if (isExpired) {
        // If the data is expired, remove it from localStorage
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setInitialFormData(null);
        setHasSavedData(false);
      } else {
        // Use the saved data if it's not expired
        setInitialFormData(parsedData.data);
        setHasSavedData(true);
      }
    } catch (error) {
      console.error('Failed to parse saved measurement data:', error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setInitialFormData(null);
      setHasSavedData(false);
    }
  }, []);

  // Function to save data to localStorage
  const saveFormData = useCallback((data: MeasurementFormData) => {
    // Don't save empty data
    if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
      return;
    }
    
    // Don't save unless we have at least a location
    if (!data.location?.trim()) {
      return;
    }
    
    // Save with timestamp for expiration checking
    const dataToSave: StoredFormData = {
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    setHasSavedData(true);
  }, []);
  
  // Function to clear saved form data
  const clearSavedForm = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setInitialFormData(null);
    setHasSavedData(false);
  }, []);

  // Check if there's a saved draft
  const hasSavedDraft = useCallback((): boolean => {
    return hasSavedData;
  }, [hasSavedData]);

  return { 
    initialFormData, 
    saveFormData,
    clearSavedForm,
    hasSavedDraft,
    loadSavedFormData
  };
};
