
import React from 'react';

interface DragDropZoneProps {
  isProcessing: boolean;
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleBrowseClick: () => void;
}

const DragDropZone: React.FC<DragDropZoneProps> = ({
  isProcessing,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleBrowseClick,
}) => {
  return (
    <div
      className={`border-dashed border-2 p-6 rounded-xl text-center transition-colors ${
        isDragging ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-300'
      } ${isProcessing ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleBrowseClick}
    >
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
  );
};

export default DragDropZone;
