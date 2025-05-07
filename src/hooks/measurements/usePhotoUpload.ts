
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MAX_FILE_SIZE, MAX_FILES } from './types';

export function usePhotoUpload() {
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoErrors, setPhotoErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  
  // Initialize with existing photos (for edit mode)
  const setInitialPhotos = (photos: string[]) => {
    setExistingPhotos(photos);
  };
  
  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" is too large (max ${MAX_FILE_SIZE / (1024 * 1024)}MB)`;
    }
    
    if (!file.type.startsWith('image/')) {
      return `File "${file.name}" is not an image`;
    }
    
    return null;
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const newErrors: string[] = [];
    
    // Check if we'd exceed max files
    if (photoFiles.length + files.length > MAX_FILES) {
      newErrors.push(`You can only upload up to ${MAX_FILES} photos`);
      setPhotoErrors(newErrors);
      return;
    }
    
    // Validate each file
    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });
    
    setPhotoFiles(prev => [...prev, ...validFiles]);
    setPhotoErrors(newErrors);
    
    // Reset the input to allow selecting the same file again
    if (e.target) {
      e.target.value = '';
    }
  };
  
  const removePhoto = (index: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const uploadPhotos = async (): Promise<string[]> => {
    if (photoFiles.length === 0) return [];
    
    const urls: string[] = [];
    
    try {
      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `measurements/${fileName}`;
        
        // Upload to Supabase storage
        const { error: uploadError, data } = await supabase.storage
          .from('measurement_photos')
          .upload(filePath, file);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('measurement_photos')
          .getPublicUrl(filePath);
        
        urls.push(publicUrl);
        
        // Update progress
        setUploadProgress(((i + 1) / photoFiles.length) * 100);
      }
      
      return urls;
    } catch (error) {
      console.error('Error uploading photos:', error);
      setPhotoErrors([...photoErrors, 'Error uploading photos. Please try again.']);
      throw error;
    }
  };
  
  const resetPhotoState = () => {
    setPhotoFiles([]);
    setPhotoErrors([]);
    setUploadProgress(0);
    setExistingPhotos([]);
  };
  
  return {
    photoFiles,
    photoErrors,
    uploadProgress,
    existingPhotos,
    handleFileChange,
    removePhoto,
    uploadPhotos,
    resetPhotoState,
    setInitialPhotos
  };
}
