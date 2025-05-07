
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MAX_FILE_SIZE, MAX_FILES } from './types';

export function usePhotoUpload() {
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoErrors, setPhotoErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
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
  
  const resetPhotoState = () => {
    setPhotoFiles([]);
    setPhotoErrors([]);
    setUploadProgress(0);
  };

  return {
    photoFiles,
    photoErrors,
    uploadProgress,
    handleFileChange,
    removePhoto,
    uploadPhotos,
    resetPhotoState
  };
}
