
// I need to fix the attachment handling by ensuring we properly access nested properties
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileUploader } from './FileUploader';
import { ProjectFormData } from '@/types/project';
import { Upload, X } from 'lucide-react';

interface AttachmentsSectionProps {
  formData: ProjectFormData;
  updateFormData: (field: string, value: any) => void;
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({ 
  formData,
  updateFormData 
}) => {
  // Function to get attachment array or initialize it
  const getAttachments = () => {
    return formData.attachments || [];
  };

  // Function to get specific attachment type or initialize it
  const getAttachmentsByType = (type: string) => {
    const attachments = getAttachments();
    // Find the attachment object for this type
    const attachmentObj = attachments.find(a => a.type === type);
    if (attachmentObj) {
      // Return the files array for this type or initialize it
      return attachmentObj[type] || [];
    }
    return [];
  };

  // Function to update attachments by type
  const updateAttachments = (type: string, files: File[]) => {
    const attachments = [...getAttachments()];
    const index = attachments.findIndex(a => a.type === type);
    
    if (index >= 0) {
      // Update existing attachment object
      attachments[index] = {
        ...attachments[index],
        [type]: files
      };
    } else {
      // Create new attachment object
      attachments.push({
        type,
        [type]: files
      });
    }
    
    updateFormData('attachments', attachments);
  };

  // Function to handle file removal
  const removeFile = (type: string, fileIndex: number) => {
    const files = [...getAttachmentsByType(type)];
    files.splice(fileIndex, 1);
    updateAttachments(type, files);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Blueprints</h3>
        <FileUploader
          onFilesAdded={(files) => {
            const blueprints = [...getAttachmentsByType('blueprints'), ...Array.from(files)];
            updateAttachments('blueprints', blueprints);
          }}
          accept=".pdf,.dwg,.dxf"
          maxSize={10 * 1024 * 1024}
        />
        
        {getAttachmentsByType('blueprints').length > 0 && (
          <div className="mt-3 space-y-2">
            {getAttachmentsByType('blueprints').map((file: File, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-zinc-800 rounded-md">
                <div className="flex items-center">
                  <Upload size={16} className="mr-2 text-zinc-400" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 hover:bg-zinc-700"
                  onClick={() => removeFile('blueprints', index)}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Site Photos</h3>
        <FileUploader
          onFilesAdded={(files) => {
            const photos = [...getAttachmentsByType('photos'), ...Array.from(files)];
            updateAttachments('photos', photos);
          }}
          accept="image/*"
          maxSize={5 * 1024 * 1024}
        />
        
        {getAttachmentsByType('photos').length > 0 && (
          <div className="mt-3 space-y-2">
            {getAttachmentsByType('photos').map((file: File, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-zinc-800 rounded-md">
                <div className="flex items-center">
                  <Upload size={16} className="mr-2 text-zinc-400" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 hover:bg-zinc-700"
                  onClick={() => removeFile('photos', index)}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Contract Documents</h3>
        <FileUploader
          onFilesAdded={(files) => {
            const contracts = [...getAttachmentsByType('contracts'), ...Array.from(files)];
            updateAttachments('contracts', contracts);
          }}
          accept=".pdf,.doc,.docx"
          maxSize={5 * 1024 * 1024}
        />
        
        {getAttachmentsByType('contracts').length > 0 && (
          <div className="mt-3 space-y-2">
            {getAttachmentsByType('contracts').map((file: File, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-zinc-800 rounded-md">
                <div className="flex items-center">
                  <Upload size={16} className="mr-2 text-zinc-400" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 hover:bg-zinc-700"
                  onClick={() => removeFile('contracts', index)}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentsSection;
