
import React, { useState } from 'react';
import ActionPanel from '@/components/ActionPanel';
import MarkdownUploader from '@/components/MarkdownUploader';
import { WindowAction } from '@/lib/parseWindowActions';

const ActionViewer: React.FC = () => {
  const [uploadedActions, setUploadedActions] = useState<WindowAction[]>([]);
  const [useUploaded, setUseUploaded] = useState(false);
  
  const handleUpload = (actions: WindowAction[]) => {
    setUploadedActions(actions);
    setUseUploaded(true);
  };
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Window Actions Viewer</h1>
      
      {isDevelopment && (
        <MarkdownUploader onUpload={handleUpload} />
      )}
      
      {useUploaded && uploadedActions.length > 0 ? (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-medium">Uploaded Actions</h2>
            <button 
              onClick={() => setUseUploaded(false)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Switch to default source
            </button>
          </div>
          
          <ActionPanel 
            actions={uploadedActions} 
            maxHeight="60vh" 
          />
        </div>
      ) : (
        <ActionPanel 
          filePath={isDevelopment ? "window-tracker-prd.md" : undefined}
          jsonPath="/data/window-actions.json"
          maxHeight="70vh"
        />
      )}
    </div>
  );
};

export default ActionViewer;
