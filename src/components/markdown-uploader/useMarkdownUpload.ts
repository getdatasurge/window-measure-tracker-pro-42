
import { useState, useRef } from 'react';
import { WindowAction, parseWindowActions } from '@/lib/parseWindowActions';
import { toast } from '@/hooks/use-toast';

export interface UseMarkdownUploadProps {
  onUpload: (actions: WindowAction[]) => void;
}

export const useMarkdownUpload = ({ onUpload }: UseMarkdownUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [markdownContent, setMarkdownContent] = useState<string>('');
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
      setMarkdownContent(text);
      
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
  
  const handleSaveMarkdown = async () => {
    if (!markdownContent || markdownContent.trim().length === 0) {
      toast({
        title: 'Cannot save empty content',
        description: 'Please upload or create markdown content first.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const response = await fetch('http://localhost:3001/save-markdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: markdownContent }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Markdown saved',
          description: 'File has been saved to disk successfully.',
        });
        setShowConfirmDialog(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error saving markdown:', error);
      toast({
        title: 'Failed to save',
        description: `Error: ${(error as Error).message}`,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveClick = () => {
    if (markdownContent) {
      setShowConfirmDialog(true);
    } else {
      toast({
        title: 'No content to save',
        description: 'Please upload or create markdown content first.',
        variant: 'destructive'
      });
    }
  };

  return {
    isDragging,
    isProcessing,
    isSaving,
    showConfirmDialog,
    setShowConfirmDialog,
    markdownContent,
    fileInputRef,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleBrowseClick,
    handleSaveMarkdown,
    handleSaveClick
  };
};
