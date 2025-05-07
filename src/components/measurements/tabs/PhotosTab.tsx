import React, { useState, useCallback } from 'react';
import { MeasurementFormData } from '@/hooks/measurements/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotosTabProps {
  formData: MeasurementFormData;
  updateFormData: (field: string, value: any) => void;
}

const PhotosTab: React.FC<PhotosTabProps> = ({ formData, updateFormData }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  
  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check file size and type
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_FILES = 3;
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    
    // Convert FileList to array for easier processing
    const fileArray = Array.from(files);
    
    // Validate files
    const invalidFiles = fileArray.filter(file => 
      file.size > MAX_FILE_SIZE || !ALLOWED_TYPES.includes(file.type)
    );
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file(s)",
        description: "Files must be images under 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Check if adding these files would exceed the maximum
    const currentPhotos = formData.photos || [];
    if (currentPhotos.length + fileArray.length > MAX_FILES) {
      toast({
        title: "Too many files",
        description: `Maximum ${MAX_FILES} photos allowed`,
        variant: "destructive"
      });
      return;
    }
    
    // Simulate upload process
    setUploading(true);
    setUploadProgress(0);
    
    // Create object URLs for preview
    const objectUrls = fileArray.map(file => URL.createObjectURL(file));
    
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          
          // Update form data with new photos
          updateFormData('photos', [...currentPhotos, ...objectUrls]);
          
          return 0;
        }
        return prev + 10;
      });
    }, 200);
    
    // Clear input value to allow selecting the same file again
    e.target.value = '';
  }, [formData.photos, updateFormData, toast]);
  
  // Remove a photo
  const handleRemovePhoto = useCallback((index: number) => {
    const updatedPhotos = [...(formData.photos || [])];
    updatedPhotos.splice(index, 1);
    updateFormData('photos', updatedPhotos);
  }, [formData.photos, updateFormData]);
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="photos" className="text-sm text-zinc-400">
          Photos <span className="text-xs text-zinc-500">(Max 3)</span>
        </Label>
        
        <div className="grid grid-cols-3 gap-4 mt-2">
          {/* Existing photos */}
          {(formData.photos || []).map((photo, index) => (
            <div 
              key={index} 
              className="relative aspect-square bg-zinc-800/50 rounded-md overflow-hidden border border-zinc-700"
            >
              {typeof photo === 'string' && (
                <div className="relative w-full h-full">
                  <img 
                    src={photo} 
                    alt={`Photo ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => handleRemovePhoto(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          {/* Upload placeholder */}
          {(formData.photos || []).length < 3 && (
            <div className="aspect-square bg-zinc-800/30 rounded-md border border-dashed border-zinc-700 flex flex-col items-center justify-center">
              <label 
                htmlFor="photo-upload" 
                className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
              >
                <Upload className="h-6 w-6 text-zinc-500 mb-2" />
                <span className="text-xs text-zinc-500">Upload</span>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple={true}
                  disabled={uploading}
                />
              </label>
            </div>
          )}
        </div>
        
        {/* Upload progress */}
        {uploading && (
          <div className="mt-2">
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-1">Uploading... {uploadProgress}%</p>
          </div>
        )}
      </div>
      
      <div className="text-xs text-zinc-500">
        <p>• Photos help installers identify the correct windows</p>
        <p>• Include any special features or obstacles</p>
        <p>• Maximum 3 photos, 5MB each</p>
      </div>
    </div>
  );
};

export default PhotosTab;
