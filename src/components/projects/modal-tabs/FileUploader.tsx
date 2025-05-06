
import React, { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFilesAdded: (files: FileList) => void;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesAdded,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  multiple = true,
  className
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const validateFiles = (files: FileList): boolean => {
    // Check for file size
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSize) {
        setError(`File "${files[i].name}" exceeds the maximum size limit (${formatFileSize(maxSize)})`);
        return false;
      }
    }

    // Clear any previous errors
    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files.length > 0) {
      if (validateFiles(e.dataTransfer.files)) {
        onFilesAdded(e.dataTransfer.files);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (validateFiles(e.target.files)) {
        onFilesAdded(e.target.files);
      }
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors",
          isDragActive ? "border-blue-500 bg-blue-500/10" : "border-zinc-700 hover:border-zinc-500",
          error ? "border-red-500 bg-red-500/10" : "",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center py-4">
          <UploadCloud className="h-8 w-8 mb-2 text-zinc-400" />
          <p className="text-sm text-zinc-400">
            <span className="font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            {accept.replace('*', '').replace('.', '')} files up to {formatFileSize(maxSize)}
          </p>
        </div>
      </div>
      {error && (
        <div className="flex items-center text-xs text-red-500">
          <X className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
