
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ProjectFormData } from '../CreateProjectModal';
import { Plus, X, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AttachmentsMetadataTabProps {
  formData: ProjectFormData;
  updateFormData: (field: keyof ProjectFormData, value: any) => void;
  errors: Partial<Record<keyof ProjectFormData, string>>;
}

const priorityOptions = ['Low', 'Medium', 'High'];

const AttachmentsMetadataTab: React.FC<AttachmentsMetadataTabProps> = ({ 
  formData, 
  updateFormData
}) => {
  const [tagInput, setTagInput] = useState('');
  
  const handleFileUpload = (field: 'blueprints' | 'photos' | 'contracts', files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      updateFormData(field, [...formData[field], ...newFiles]);
    }
  };
  
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      updateFormData('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const removeTag = (tag: string) => {
    updateFormData('tags', formData.tags.filter(t => t !== tag));
  };
  
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Attachments Section */}
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
            {formData.blueprints.length > 0 && (
              <div className="mt-2 space-y-2">
                {formData.blueprints.map((file, index) => (
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
            {formData.photos.length > 0 && (
              <div className="mt-2 space-y-2">
                {formData.photos.map((file, index) => (
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
            {formData.contracts.length > 0 && (
              <div className="mt-2 space-y-2">
                {formData.contracts.map((file, index) => (
                  <div key={index} className="text-xs text-zinc-400">
                    • {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Additional Metadata Section */}
      <div className="space-y-4 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <h3 className="text-sm font-medium text-white">Additional Metadata</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-zinc-400">
              Tags
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} className="flex items-center gap-1 bg-green-500/20 text-green-400 hover:bg-green-500/30">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyPress}
                className="bg-zinc-800/50 border-zinc-700 text-white rounded-r-none"
                placeholder="Add a tag"
              />
              <Button 
                type="button"
                onClick={addTag}
                className="bg-zinc-800 hover:bg-zinc-700 rounded-l-none"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm text-zinc-400">
                Priority Level
              </Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => updateFormData('priority', value)}
              >
                <SelectTrigger id="priority" className="bg-zinc-800/50 border-zinc-700 text-white">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budgetEstimate" className="text-sm text-zinc-400">
                Budget Estimate ($)
              </Label>
              <Input
                id="budgetEstimate"
                type="text"
                value={formData.budgetEstimate}
                onChange={(e) => updateFormData('budgetEstimate', e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 text-white"
                placeholder="Enter budget amount"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Audit Information Section */}
      <div className="space-y-4 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <h3 className="text-sm font-medium text-white">Audit Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-zinc-400">
              Created By
            </Label>
            <p className="text-sm text-zinc-300">{formData.createdBy}</p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm text-zinc-400">
              Created At
            </Label>
            <p className="text-sm text-zinc-300">{formData.createdAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentsMetadataTab;
