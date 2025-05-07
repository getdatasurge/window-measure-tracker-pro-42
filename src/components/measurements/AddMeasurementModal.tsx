
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAddMeasurementForm } from '@/hooks/useAddMeasurementForm';
import ProjectSelector from './form/ProjectSelector';
import AttributesFields from './form/AttributesFields';
import DimensionsFields from './form/DimensionsFields';
import PhotoUploader from './PhotoUploader';

interface AddMeasurementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  projectName?: string;
}

const AddMeasurementModal: React.FC<AddMeasurementModalProps> = ({ 
  open, 
  onOpenChange,
  projectId: initialProjectId,
  projectName: initialProjectName
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    isSubmitting,
    projectsList,
    photoFiles,
    photoErrors,
    uploadProgress,
    onSubmit,
    handleProjectChange,
    handleFileChange,
    removePhoto,
    fetchProjects,
    reset,
    formState,
    calculateArea
  } = useAddMeasurementForm({
    onSuccess: () => onOpenChange(false),
    initialProjectId,
    initialProjectName
  });
  
  // Reference to first input field for auto-focus
  const locationInputRef = useRef<HTMLInputElement | null>(null);
  
  // Fetch projects on modal open and focus the first field
  useEffect(() => {
    if (open) {
      fetchProjects();
      
      // Set focus to the location input after a short delay to ensure the modal has rendered
      setTimeout(() => {
        if (locationInputRef.current) {
          locationInputRef.current.focus();
        }
      }, 100);
    }
  }, [open, fetchProjects]);
  
  // Calculate area whenever width, height, or quantity changes
  const width = watch('width');
  const height = watch('height');
  const quantity = watch('quantity');
  
  useEffect(() => {
    calculateArea(width, height, quantity);
  }, [width, height, quantity, calculateArea]);
  
  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            handleClose();
          }
        }}
        aria-labelledby="add-measurement-title"
      >
        <DialogHeader>
          <DialogTitle id="add-measurement-title" className="text-xl">Add New Measurement</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Project Selection */}
            <ProjectSelector
              projectId={watch('projectId')}
              projects={projectsList}
              onProjectChange={handleProjectChange}
              error={errors.projectId?.message}
            />
            
            {/* Location, Direction, Film Required, Notes */}
            <AttributesFields 
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              ref={locationInputRef}
            />
            
            {/* Dimensions */}
            <DimensionsFields 
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
            />
            
            {/* Photo Upload */}
            <div className="space-y-2">
              <PhotoUploader
                photoFiles={photoFiles}
                photoErrors={photoErrors}
                uploadProgress={uploadProgress}
                onFileChange={handleFileChange}
                onRemovePhoto={removePhoto}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Measurement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMeasurementModal;
