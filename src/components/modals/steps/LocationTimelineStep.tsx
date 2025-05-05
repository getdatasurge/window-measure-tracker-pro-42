
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { MapPin } from 'lucide-react';
import { ProjectFormValues } from '../project-form/validation-schema';
import LocationFields from './location-timeline/LocationFields';
import TimelineFields from './location-timeline/TimelineFields';
import { FormSection } from '../form-layout';

interface LocationTimelineStepProps {
  form: UseFormReturn<ProjectFormValues>;
}

const LocationTimelineStep: React.FC<LocationTimelineStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">
          <MapPin className="h-5 w-5 inline-block mr-2" />
          Location & Timeline
        </h2>
        <p className="text-sm text-zinc-400 mb-4">Enter the project location and timeline details.</p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          <FormSection>
            <LocationFields form={form} />
          </FormSection>
          
          <FormSection>
            <TimelineFields form={form} />
          </FormSection>
        </div>
      </Form>
    </div>
  );
};

export default LocationTimelineStep;
