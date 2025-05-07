
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { useMeasurements } from '@/hooks/useMeasurements';

export interface MeasurementFormData {
  projectId: string;
  projectName: string;
  location: string;
  width: string;
  height: string;
  depth?: string;
  direction?: string;
  notes?: string;
  filmRequired: boolean;
  quantity: number;
  photos: File[];
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES = 3;

export const useAddMeasurementForm = (
  onSuccess: () => void,
  initialProjectId?: string,
  initialProjectName?: string
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { refetchMeasurements } = useMeasurements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectsList, setProjectsList] = useState<{id: string, name: string}[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoErrors, setPhotoErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<MeasurementFormData>({
    defaultValues: {
      projectId: initialProjectId || '',
      projectName: initialProjectName || '',
      location: '',
      width: '',
      height: '',
      depth: '',
      direction: 'N/A',
      notes: '',
      filmRequired: true,
      quantity: 1,
      photos: []
    }
  });
  
  // Fetch projects for dropdown
  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
        
      if (error) throw error;
      
      if (data) {
        setProjectsList(data);
        
        // Set initial project if provided
        if (initialProjectId && initialProjectName) {
          setValue('projectId', initialProjectId);
          setValue('projectName', initialProjectName);
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
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  }, [setValue, initialProjectId, initialProjectName]);
  
  const handleProjectChange = (projectId: string) => {
    const selectedProject = projectsList.find(p => p.id === projectId);
    if (selectedProject) {
      setValue('projectId', selectedProject.id);
      setValue('projectName', selectedProject.name);
    }
  };
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const errors: string[] = [];
    
    if (!files) return;
    
    // Check if adding these files would exceed the limit
    const newFiles = Array.from(files);
    
    if (photoFiles.length + newFiles.length > MAX_FILES) {
      errors.push(`You can only upload a maximum of ${MAX_FILES} photos.`);
      setPhotoErrors(errors);
      return;
    }
    
    // Validate each file
    const validFiles = newFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`File "${file.name}" exceeds 5MB size limit.`);
        return false;
      }
      
      if (!file.type.startsWith('image/')) {
        errors.push(`File "${file.name}" is not an image.`);
        return false;
      }
      
      return true;
    });
    
    setPhotoErrors(errors);
    
    if (validFiles.length > 0) {
      setPhotoFiles(prev => [...prev, ...validFiles]);
    }
    
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  }, [photoFiles]);
  
  const removePhoto = useCallback((index: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  const uploadPhotos = async (): Promise<string[]> => {
    if (photoFiles.length === 0) return [];
    
    const uploadedUrls: string[] = [];
    
    try {
      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `measurements/${fileName}`;
        
        setUploadProgress(Math.round(((i) / photoFiles.length) * 100));
        
        const { data, error } = await supabase.storage
          .from('measurements')
          .upload(filePath, file);
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Get public URL for the uploaded file
          const { data: publicUrlData } = supabase.storage
            .from('measurements')
            .getPublicUrl(filePath);
            
          if (publicUrlData.publicUrl) {
            uploadedUrls.push(publicUrlData.publicUrl);
          }
        }
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / photoFiles.length) * 100));
      }
      
      return uploadedUrls;
    } catch (err) {
      console.error('Error uploading photos:', err);
      throw err;
    }
  };
  
  const onSubmit = async (data: MeasurementFormData) => {
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
    
    setIsSubmitting(true);
    
    try {
      // Upload photos first
      let photoUrls: string[] = [];
      
      if (photoFiles.length > 0) {
        try {
          photoUrls = await uploadPhotos();
        } catch (err) {
          toast({
            title: "Photo upload failed",
            description: err instanceof Error ? err.message : "Failed to upload photos. Please try again.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }
      
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
        direction: data.direction?.toLowerCase() || 'n/a',
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
      
      // Reset form state
      setPhotoFiles([]);
      setPhotoErrors([]);
      setUploadProgress(0);
      
      // Refetch measurements to update UI
      await refetchMeasurements();
      
      // Reset form and close modal
      reset();
      onSuccess();
      
    } catch (err) {
      console.error('Error saving measurement:', err);
      toast({
        title: "Error saving measurement",
        description: err instanceof Error ? err.message : "Failed to save measurement. Please check your data and try again.",
        variant: "destructive",
        duration: 5000, // Auto dismiss after 5 seconds
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    isSubmitting,
    projectsList,
    photoFiles,
    photoErrors,
    uploadProgress,
    onSubmit,
    handleProjectChange,
    handleFileChange,
    removePhoto,
    fetchProjects,
    reset
  };
};
