
import React from 'react';
import { WindowAction } from '@/lib/parseWindowActions';
import { Button } from '@/components/ui/button';
import DragDropZone from './DragDropZone';
import SaveConfirmDialog from './SaveConfirmDialog';
import { useMarkdownUpload } from './useMarkdownUpload';

interface MarkdownUploaderProps {
  onUpload: (actions: WindowAction[]) => void;
}

const MarkdownUploader: React.FC<MarkdownUploaderProps> = ({ onUpload }) => {
  const {
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
  } = useMarkdownUpload({ onUpload });
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="mb-6">
      <input
        type="file"
        accept=".md,text/markdown"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isProcessing}
      />
      
      <DragDropZone 
        isProcessing={isProcessing}
        isDragging={isDragging}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        handleBrowseClick={handleBrowseClick}
      />
      
      {markdownContent && (
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={handleSaveClick}
            className="bg-yellow-100 text-yellow-900 hover:bg-yellow-200 shadow"
            disabled={isSaving || !markdownContent}
          >
            {isSaving ? 'Saving...' : 'Save to Disk'}
          </Button>
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        <p>Dev mode only: Upload a markdown file to see parsed actions in real-time.</p>
      </div>
      
      <SaveConfirmDialog 
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleSaveMarkdown}
        isSaving={isSaving}
      />
    </div>
  );
};

export default MarkdownUploader;
