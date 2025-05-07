
import React, { useEffect } from 'react';
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
    reset
  } = useAddMeasurementForm(
    () => onOpenChange(false),
    initialProjectId,
    initialProjectName
  );
  
  // Fetch projects on modal open
  useEffect(() => {
    if (open) {
      fetchProjects();
    }
  }, [open, fetchProjects]);
  
  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Measurement</DialogTitle>
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
            />
            
            {/* Dimensions */}
            <DimensionsFields 
              register={register}
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
