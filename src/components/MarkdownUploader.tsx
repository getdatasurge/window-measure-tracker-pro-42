
import React, { useState, useRef } from 'react';
import { parseWindowActions, WindowAction } from '@/lib/parseWindowActions';
import { toast } from '@/hooks/use-toast';

interface MarkdownUploaderProps {
  onUpload: (actions: WindowAction[]) => void;
}

const MarkdownUploader: React.FC<MarkdownUploaderProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Process uploaded markdown file
  const processFile = async (file: File) => {
    if (!file || file.type !== 'text/markdown' && !file.name.endsWith('.md')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a markdown (.md) file.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Read file contents
      const text = await file.text();
      
      // Parse markdown to actions
      const actions = parseWindowActions(text);
      
      // Update parent component with new actions
      onUpload(actions);
      
      // Show success message
      toast({
        title: 'File processed successfully',
        description: `Parsed ${actions.length} action${actions.length !== 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error('Error processing markdown file:', error);
      toast({
        title: 'Error processing file',
        description: (error as Error).message,
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      setIsDragging(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="mb-6">
      <div
        className={`border-dashed border-2 p-6 rounded-xl text-center transition-colors ${
          isDragging ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-300'
        } ${isProcessing ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          type="file"
          accept=".md,text/markdown"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isProcessing}
        />
        
        {isProcessing ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
            <p>Processing file...</p>
          </div>
        ) : (
          <div>
            <div className="mb-2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-1">Drag and drop your markdown file here</p>
            <p className="text-gray-500 text-sm">or click to browse your files</p>
            <p className="text-xs text-gray-400 mt-2">Only .md files are supported</p>
          </div>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <p>Dev mode only: Upload a markdown file to see parsed actions in real-time.</p>
      </div>
    </div>
  );
};

export default MarkdownUploader;
