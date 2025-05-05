
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { ProjectFormData } from '@/types/project';

interface AttachmentsSectionProps {
  formData: ProjectFormData;
  updateFormData: (field: string, value: any) => void;
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({ 
  formData, 
  updateFormData 
}) => {
  const handleFileUpload = (field: 'blueprints' | 'photos' | 'contracts', files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      updateFormData(`attachments.${field}`, [...(formData.attachments?.[field] || []), ...newFiles]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-4 rounded-full bg-green-500"></div>
        <h3 className="text-sm font-medium text-white">Attachments & Documentation</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-zinc-400">
            Blueprints / Drawings
          </Label>
          <div className="flex">
            <Button 
              type="button"
              variant="outline" 
              className="flex items-center gap-1 bg-zinc-800/70 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white"
              onClick={() => document.getElementById('blueprintsUpload')?.click()}
            >
              <Upload className="h-4 w-4" />
              <span>Upload Blueprints</span>
            </Button>
            <input
              id="blueprintsUpload"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload('blueprints', e.target.files)}
            />
          </div>
          {formData.attachments?.blueprints && formData.attachments.blueprints.length > 0 && (
            <div className="mt-2 space-y-2">
              {formData.attachments.blueprints.map((file, index) => (
                <div key={index} className="text-xs text-zinc-400">
                  • {file.name}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm text-zinc-400">
            Photos
          </Label>
          <div className="flex">
            <Button 
              type="button"
              variant="outline" 
              className="flex items-center gap-1 bg-zinc-800/70 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white"
              onClick={() => document.getElementById('photosUpload')?.click()}
            >
              <Upload className="h-4 w-4" />
              <span>Upload Photos</span>
            </Button>
            <input
              id="photosUpload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload('photos', e.target.files)}
            />
          </div>
          {formData.attachments?.photos && formData.attachments.photos.length > 0 && (
            <div className="mt-2 space-y-2">
              {formData.attachments.photos.map((file, index) => (
                <div key={index} className="text-xs text-zinc-400">
                  • {file.name}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm text-zinc-400">
            Contracts / Agreements
          </Label>
          <div className="flex">
            <Button 
              type="button"
              variant="outline" 
              className="flex items-center gap-1 bg-zinc-800/70 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white"
              onClick={() => document.getElementById('contractsUpload')?.click()}
            >
              <Upload className="h-4 w-4" />
              <span>Upload Contracts</span>
            </Button>
            <input
              id="contractsUpload"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload('contracts', e.target.files)}
            />
          </div>
          {formData.attachments?.contracts && formData.attachments.contracts.length > 0 && (
            <div className="mt-2 space-y-2">
              {formData.attachments.contracts.map((file, index) => (
                <div key={index} className="text-xs text-zinc-400">
                  • {file.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachmentsSection;
