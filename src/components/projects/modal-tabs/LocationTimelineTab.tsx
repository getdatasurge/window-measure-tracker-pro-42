
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ProjectFormData } from '@/types/project';
import FormGrid from '@/components/form/FormGrid';
import FormSection from '@/components/form/FormSection';
import FormRow from '@/components/form/FormRow';

interface LocationTimelineTabProps {
  formData: ProjectFormData;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string | undefined>;
}

const LocationTimelineTab: React.FC<LocationTimelineTabProps> = ({ 
  formData, 
  updateFormData,
  errors
}) => {
  // Helper to handle nested location updates
  const updateLocation = (field: string, value: string) => {
    updateFormData(`location.${field}`, value);
  };

  // Helper to handle nested timeline updates
  const updateTimeline = (field: string, value: string) => {
    updateFormData(`timeline.${field}`, value);
  };

  return (
    <div className="space-y-6">
      <FormSection title="Location Information" description="Enter the location details for this project">
        <FormGrid columns={2}>
          <FormRow>
            <Label htmlFor="addressLine1" className="text-sm text-zinc-400">
              Address Line 1
            </Label>
            <Input
              id="addressLine1"
              placeholder="Street address"
              value={formData.location?.addressLine1 || ''}
              onChange={(e) => updateLocation('addressLine1', e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
            />
            {errors['location.addressLine1'] && <p className="text-xs text-red-500 mt-1">{errors['location.addressLine1']}</p>}
          </FormRow>

          <FormRow>
            <Label htmlFor="addressLine2" className="text-sm text-zinc-400">
              Address Line 2
            </Label>
            <Input
              id="addressLine2"
              placeholder="Apt, Suite, Building (optional)"
              value={formData.location?.addressLine2 || ''}
              onChange={(e) => updateLocation('addressLine2', e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
            />
          </FormRow>

          <FormRow>
            <Label htmlFor="city" className="text-sm text-zinc-400">
              City
            </Label>
            <Input
              id="city"
              placeholder="City"
              value={formData.location?.city || ''}
              onChange={(e) => updateLocation('city', e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
            />
            {errors['location.city'] && <p className="text-xs text-red-500 mt-1">{errors['location.city']}</p>}
          </FormRow>

          <FormRow>
            <Label htmlFor="state" className="text-sm text-zinc-400">
              State
            </Label>
            <Input
              id="state"
              placeholder="State"
              value={formData.location?.state || ''}
              onChange={(e) => updateLocation('state', e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
            />
            {errors['location.state'] && <p className="text-xs text-red-500 mt-1">{errors['location.state']}</p>}
          </FormRow>

          <FormRow>
            <Label htmlFor="zip" className="text-sm text-zinc-400">
              ZIP Code
            </Label>
            <Input
              id="zip"
              placeholder="ZIP"
              value={formData.location?.zip || ''}
              onChange={(e) => updateLocation('zip', e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
            />
            {errors['location.zip'] && <p className="text-xs text-red-500 mt-1">{errors['location.zip']}</p>}
          </FormRow>
        </FormGrid>
      </FormSection>

      <FormSection title="Timeline" description="Schedule the project timeline">
        <FormGrid columns={2}>
          <FormRow>
            <Label htmlFor="startDate" className="text-sm text-zinc-400">
              Start Date
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="startDate"
              type="date"
              value={formData.timeline?.startDate || ''}
              onChange={(e) => updateTimeline('startDate', e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
            />
            {errors['timeline.startDate'] && <p className="text-xs text-red-500 mt-1">{errors['timeline.startDate']}</p>}
          </FormRow>

          <FormRow>
            <Label htmlFor="endDate" className="text-sm text-zinc-400">
              Estimated End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={formData.timeline?.endDate || ''}
              onChange={(e) => updateTimeline('endDate', e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
            />
          </FormRow>
        </FormGrid>
      </FormSection>
    </div>
  );
};

export default LocationTimelineTab;
