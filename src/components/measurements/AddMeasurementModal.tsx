
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { useForm } from 'react-hook-form';
import { useMeasurements } from '@/hooks/useMeasurements';

interface AddMeasurementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  projectName?: string;
}

interface MeasurementFormData {
  projectId: string;
  projectName: string;
  location: string;
  width: string;
  height: string;
  depth?: string;
  direction?: string;
  notes?: string;
  filmRequired: boolean;
  quantity: number;
}

const AddMeasurementModal: React.FC<AddMeasurementModalProps> = ({ 
  open, 
  onOpenChange,
  projectId: initialProjectId,
  projectName: initialProjectName
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { refetchMeasurements } = useMeasurements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectsList, setProjectsList] = useState<{id: string, name: string}[]>([]);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<MeasurementFormData>({
    defaultValues: {
      projectId: initialProjectId || '',
      projectName: initialProjectName || '',
      location: '',
      width: '',
      height: '',
      depth: '',
      direction: 'N/A',
      notes: '',
      filmRequired: true,
      quantity: 1
    }
  });
  
  // Fetch projects on mount
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .eq('is_active', true)
          .order('name');
          
        if (error) throw error;
        
        if (data) {
          setProjectsList(data);
          
          // Set initial project if provided
          if (initialProjectId && initialProjectName) {
            setValue('projectId', initialProjectId);
            setValue('projectName', initialProjectName);
          } 
          // Set last used project if available
          else {
            const lastProject = localStorage.getItem('lastSelectedProject');
            if (lastProject) {
              try {
                const { id, name } = JSON.parse(lastProject);
                setValue('projectId', id);
                setValue('projectName', name);
              } catch (e) {
                console.error('Error parsing last project', e);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    
    fetchProjects();
  }, [setValue, initialProjectId, initialProjectName]);
  
  const handleProjectChange = (projectId: string) => {
    const selectedProject = projectsList.find(p => p.id === projectId);
    if (selectedProject) {
      setValue('projectId', selectedProject.id);
      setValue('projectName', selectedProject.name);
    }
  };
  
  const onSubmit = async (data: MeasurementFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to save measurements.",
        variant: "destructive"
      });
      return;
    }
    
    if (!data.projectId) {
      toast({
        title: "Project required",
        description: "Please select a project for this measurement.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Parse numeric values to ensure they're saved as numbers
      const parseNumericValue = (value: string | undefined): number | null => {
        if (!value) return null;
        const numericStr = value.replace(/[^0-9.]/g, '');
        const parsed = parseFloat(numericStr);
        return isNaN(parsed) ? null : parsed;
      };
      
      const width = parseNumericValue(data.width);
      const height = parseNumericValue(data.height);
      const depth = parseNumericValue(data.depth);
      
      // Calculate area if width and height are provided
      let area = null;
      if (width && height) {
        area = (width * height) / 144; // Convert to square feet (from inches)
      }
      
      // Prepare data for database submission
      const measurementData = {
        project_id: data.projectId,
        location: data.location.trim(),
        width,
        height,
        depth,
        area,
        quantity: data.quantity || 1,
        recorded_by: user.id,
        direction: data.direction?.toLowerCase() || 'n/a',
        notes: data.notes || '',
        status: 'pending',
        measurement_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: user.id,
        film_required: data.filmRequired
      };
      
      // Save to supabase
      const { data: insertedData, error } = await supabase
        .from('measurements')
        .insert(measurementData)
        .select();
        
      if (error) {
        throw error;
      }
      
      // Save last selected project to localStorage
      localStorage.setItem('lastSelectedProject', JSON.stringify({
        id: data.projectId,
        name: data.projectName
      }));
      
      // Show success message
      toast({
        title: "Measurement saved",
        description: "The measurement has been successfully created."
      });
      
      // Refetch measurements to update UI
      await refetchMeasurements();
      
      // Reset form and close modal
      reset();
      onOpenChange(false);
      
    } catch (err) {
      console.error('Error saving measurement:', err);
      toast({
        title: "Error saving measurement",
        description: err instanceof Error ? err.message : "Failed to save measurement. Please check your data and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
            <div className="space-y-2">
              <Label htmlFor="projectId">Project</Label>
              <Select
                value={watch('projectId')}
                onValueChange={handleProjectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projectsList.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-sm text-red-500">{errors.projectId.message}</p>
              )}
            </div>
            
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. Living Room Window"
                {...register('location', { required: "Location is required" })}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>
            
            {/* Dimensions */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (inches)</Label>
                <Input
                  id="width"
                  placeholder="Width"
                  {...register('width', { required: "Width is required" })}
                />
                {errors.width && (
                  <p className="text-sm text-red-500">{errors.width.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height (inches)</Label>
                <Input
                  id="height"
                  placeholder="Height"
                  {...register('height', { required: "Height is required" })}
                />
                {errors.height && (
                  <p className="text-sm text-red-500">{errors.height.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="depth">Depth (inches)</Label>
                <Input
                  id="depth"
                  placeholder="Depth (optional)"
                  {...register('depth')}
                />
              </div>
            </div>
            
            {/* Direction and Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="direction">Direction</Label>
                <Select
                  value={watch('direction')}
                  onValueChange={(value) => setValue('direction', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North">North</SelectItem>
                    <SelectItem value="South">South</SelectItem>
                    <SelectItem value="East">East</SelectItem>
                    <SelectItem value="West">West</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  {...register('quantity', { 
                    required: "Quantity is required",
                    min: { value: 1, message: "Minimum quantity is 1" }
                  })}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity.message}</p>
                )}
              </div>
            </div>
            
            {/* Film Required */}
            <div className="flex items-center space-x-2">
              <Switch
                id="filmRequired"
                checked={watch('filmRequired')}
                onCheckedChange={(checked) => setValue('filmRequired', checked)}
              />
              <Label htmlFor="filmRequired">Film Required</Label>
            </div>
            
            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes or comments"
                {...register('notes')}
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
