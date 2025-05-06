
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'react-toastify';

interface FileUploaderProps {
  onFilesAdded?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
  projectId?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  uploading: boolean;
  error: boolean;
  success: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesAdded,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept,
  projectId
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files (too large, wrong format, etc.)
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach((rejection) => {
        const { file, errors } = rejection;
        const errorMessages = errors.map((error: any) => error.message).join(', ');
        toast.error(`Error with ${file.name}: ${errorMessages}`);
      });
    }
    
    // Handle accepted files
    if (acceptedFiles.length > 0) {
      // Check if we're exceeding the max number of files
      if (uploadingFiles.length + acceptedFiles.length > maxFiles) {
        toast.error(`You can only upload a maximum of ${maxFiles} files`);
        return;
      }

      // Add the new files to our state with initial progress
      const newFiles = acceptedFiles.map(file => ({
        file,
        progress: 0,
        uploading: true,
        error: false,
        success: false
      }));
      
      setUploadingFiles(prev => [...prev, ...newFiles]);

      // Simulate upload process (In a real app, you would use Supabase Storage or another service)
      simulateUpload(newFiles);
      
      // If you have an onFilesAdded callback, call it with the accepted files
      if (onFilesAdded) {
        onFilesAdded(acceptedFiles);
      }
    }
  }, [uploadingFiles, maxFiles, onFilesAdded]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: accept ? { [accept]: [] } : undefined,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false)
  });

  // Function to simulate file upload
  const simulateUpload = (files: UploadingFile[]) => {
    files.forEach((fileObj, index) => {
      const intervalId = setInterval(() => {
        setUploadingFiles(currentFiles => 
          currentFiles.map((f, i) => {
            if (f.file === fileObj.file) {
              // Increase progress by 10% each time
              const newProgress = Math.min(f.progress + 10, 100);
              const isComplete = newProgress === 100;
              
              if (isComplete) {
                clearInterval(intervalId);
                toast.success(`${f.file.name} uploaded successfully!`);
              }
              
              return {
                ...f,
                progress: newProgress,
                uploading: !isComplete,
                success: isComplete
              };
            }
            return f;
          })
        );
      }, 500);
    });
  };

  const removeFile = (fileToRemove: File) => {
    setUploadingFiles(files => files.filter(f => f.file !== fileToRemove));
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed p-8 rounded-lg text-center cursor-pointer transition-all
          ${isDragActive ? 'border-blue-500 bg-blue-50/5' : 'border-zinc-700 hover:border-zinc-500'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-zinc-500" />
        <p className="mt-2 text-sm text-zinc-400">
          Drag & drop files here, or <span className="text-blue-500">click to browse</span>
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Max {maxFiles} files, up to {Math.round(maxSize / (1024 * 1024))}MB each
        </p>
      </div>

      {/* File list */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Files</h4>
          <div className="space-y-2">
            {uploadingFiles.map((fileObj) => (
              <div key={fileObj.file.name + fileObj.file.size} className="flex items-center gap-3 bg-zinc-800/50 p-2 rounded border border-zinc-700">
                <div className="min-w-[24px] flex justify-center">
                  {fileObj.uploading && <Loader2 className="h-5 w-5 text-zinc-400 animate-spin" />}
                  {fileObj.success && <Check className="h-5 w-5 text-green-500" />}
                  {fileObj.error && <X className="h-5 w-5 text-red-500" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm">
                    <p className="truncate text-zinc-200">{fileObj.file.name}</p>
                    <p className="text-zinc-400 pl-2">
                      {(fileObj.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Progress value={fileObj.progress} className="h-1 mt-2" />
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(fileObj.file);
                  }}
                >
                  <X className="h-4 w-4 text-zinc-400" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
