
import { useState, useEffect } from 'react';
import { MeasurementFormData } from './types';
import { Direction } from '@/constants/direction';

interface UseFormInitializationProps {
  editMode: boolean;
  measurementToEdit?: any;
  initialFormData: any;
  initialProjectId?: string;
  initialProjectName?: string;
  setValue: (field: keyof MeasurementFormData, value: any) => void;
}

export function useFormInitialization({
  editMode,
  measurementToEdit,
  initialFormData,
  initialProjectId,
  initialProjectName,
  setValue
}: UseFormInitializationProps) {
  const [hasSavedDraft, setHasSavedDraft] = useState<boolean>(false);

  // Check if there's a saved draft
  useEffect(() => {
    if (initialFormData && !editMode) {
      setHasSavedDraft(true);
    }
  }, [initialFormData, editMode]);

  // Set initial project value based on props or localStorage
  useEffect(() => {
    // If editing, project values are already set
    if (editMode && measurementToEdit) return;
    
    // Set initial project if provided
    if (initialProjectId && initialProjectName) {
      setValue('projectId', initialProjectId);
      setValue('projectName', initialProjectName);
    } 
    // Use saved draft if available
    else if (initialFormData && (initialFormData as any).projectId && (initialFormData as any).projectName) {
      setValue('projectId', (initialFormData as any).projectId);
      setValue('projectName', (initialFormData as any).projectName);
    }
    // Set last used project if available
    else {
      const lastProject = localStorage.getItem('lastSelectedProject');
      if (lastProject) {
        try {
          const { id, name } = JSON.parse(lastProject);
          setValue('projectId', id);
          setValue('projectName', name);
        } catch (e) {
          console.error('Error parsing last project', e);
        }
      }
    }
  }, [initialProjectId, initialProjectName, setValue, editMode, measurementToEdit, initialFormData]);
  
  // Load last used fractional values from localStorage
  useEffect(() => {
    const lastWidthFraction = localStorage.getItem('lastWidthFraction');
    const lastHeightFraction = localStorage.getItem('lastHeightFraction');
    
    if (lastWidthFraction) {
      document.querySelectorAll('[data-width-fraction="' + lastWidthFraction + '"]').forEach(el => {
        (el as HTMLElement).classList.add('bg-zinc-700'); // Highlight the last used fraction
      });
    }
    
    if (lastHeightFraction) {
      document.querySelectorAll('[data-height-fraction="' + lastHeightFraction + '"]').forEach(el => {
        (el as HTMLElement).classList.add('bg-zinc-700'); // Highlight the last used fraction
      });
    }
  }, []);

  // Create default values based on mode
  const getDefaultValues = (): Partial<MeasurementFormData> => {
    if (editMode && measurementToEdit) {
      return {
        projectId: measurementToEdit.projectId || '',
        projectName: measurementToEdit.projectName || '',
        location: measurementToEdit.location || '',
        width: measurementToEdit.width || '',
        height: measurementToEdit.height || '',
        direction: measurementToEdit.direction || 'N/A' as Direction,
        notes: measurementToEdit.notes || '',
        filmRequired: measurementToEdit.film_required !== false, // Default to true if undefined
        quantity: measurementToEdit.quantity || 1,
        photos: [],
        installationDate: measurementToEdit.installationDate || '',
        input_source: measurementToEdit.input_source || 'manual'
      };
    } else if (initialFormData) {
      // Convert string[] photos if needed
      const formPhotos = Array.isArray((initialFormData as any).photos) 
        ? (initialFormData as any).photos.filter((p: any) => p instanceof File) 
        : [];
        
      return {
        ...initialFormData as Partial<MeasurementFormData>,
        projectId: initialProjectId || (initialFormData as any).projectId || '',
        projectName: initialProjectName || (initialFormData as any).projectName || '',
        photos: formPhotos,
        input_source: 'manual'
      };
    } else {
      return {
        projectId: initialProjectId || '',
        projectName: initialProjectName || '',
        location: '',
        width: '',
        height: '',
        direction: 'N/A' as Direction,
        notes: '',
        filmRequired: true,
        quantity: 1,
        photos: [],
        input_source: 'manual'
      };
    }
  };

  return {
    hasSavedDraft,
    getDefaultValues
  };
}
