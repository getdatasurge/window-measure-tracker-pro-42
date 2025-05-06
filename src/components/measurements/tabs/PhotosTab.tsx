
import React, { useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Measurement } from '@/types/measurement';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PhotosTabProps {
  formData: Measurement;
  updateFormData: (field: string, value: any) => void;
}

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const PhotosTab: React.FC<PhotosTabProps> = ({ formData, updateFormData }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate number of files
    if (files.length > MAX_FILES || (formData.photos?.length || 0) + files.length > MAX_FILES) {
      toast({
        title: "Too many files",
        description: `You can only upload a maximum of ${MAX_FILES} files.`,
        variant: "destructive"
      });
      return;
    }

    // Validate file size
    const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Files too large",
        description: `Some files exceed the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.`,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique folder name based on current time and random string
      const folderName = `measurements/${new Date().getTime()}-${Math.random().toString(36).substring(2, 15)}`;
      
      // Upload each file and collect the URLs
      const uploadPromises = files.map(async (file) => {
        const filePath = `${folderName}/${file.name}`;
        const { data, error } = await supabase.storage
          .from('measurements')
          .upload(filePath, file);
        
        if (error) throw error;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('measurements')
          .getPublicUrl(filePath);
          
        return publicUrlData.publicUrl;
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Update formData with new photos
      const currentPhotos = formData.photos || [];
      updateFormData('photos', [...currentPhotos, ...uploadedUrls]);
      
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${files.length} file(s).`
      });
      
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your files.",
        variant: "destructive"
      });
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const removePhoto = (index: number) => {
    if (!formData.photos) return;
    
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    updateFormData('photos', newPhotos);
  };

  return (
    <div className="space-y-4">
      <div className="border border-dashed border-zinc-700 rounded-md p-6 text-center">
        <Label htmlFor="photo-upload" className="cursor-pointer block">
          <Upload className="mx-auto h-12 w-12 text-zinc-500 mb-2" />
          <span className="text-zinc-400 block mb-2">
            Upload photos (Max {MAX_FILES} files, {MAX_FILE_SIZE / (1024 * 1024)}MB each)
          </span>
          <Button 
            variant="outline" 
            className="bg-zinc-800 hover:bg-zinc-700"
            disabled={isUploading || (formData.photos?.length || 0) >= MAX_FILES}
          >
            {isUploading ? 'Uploading...' : 'Select Files'}
          </Button>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading || (formData.photos?.length || 0) >= MAX_FILES}
          />
        </Label>
      </div>

      {formData.photos && formData.photos.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Uploaded Photos</h3>
          <div className="grid grid-cols-3 gap-3">
            {formData.photos.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt={`Measurement photo ${index + 1}`} 
                  className="h-28 w-full object-cover rounded-md border border-zinc-700" 
                />
                <Button 
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosTab;
