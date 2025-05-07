
import React from 'react';
import { Image, X } from 'lucide-react';
import { MAX_FILES } from '@/hooks/useAddMeasurementForm';

interface PhotoUploaderProps {
  photoFiles: File[];
  photoErrors: string[];
  uploadProgress: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (index: number) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photoFiles,
  photoErrors,
  uploadProgress,
  onFileChange,
  onRemovePhoto
}) => {
  return (
    <div className="space-y-2">
      <div className="border rounded-md p-4">
        {/* Photo Preview */}
        {photoFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {photoFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden border bg-muted">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemovePhoto(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md opacity-80 hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Upload Button */}
        {photoFiles.length < MAX_FILES && (
          <div className="flex justify-center">
            <label htmlFor="photo-upload" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-2 py-4">
                <div className="p-2 rounded-full bg-muted">
                  <Image className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Click to upload photos ({photoFiles.length}/{MAX_FILES})
                </span>
              </div>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
                multiple={MAX_FILES - photoFiles.length > 1}
              />
            </label>
          </div>
        )}
        
        {/* Error Messages */}
        {photoErrors.length > 0 && (
          <div className="mt-2">
            {photoErrors.map((error, index) => (
              <p key={index} className="text-xs text-red-500">{error}</p>
            ))}
          </div>
        )}
        
        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUploader;
