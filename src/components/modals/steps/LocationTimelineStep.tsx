
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { ProjectFormValues } from '../CreateProjectModal';
import { MapPin } from 'lucide-react';
import LocationFields from './location-timeline/LocationFields';
import TimelineFields from './location-timeline/TimelineFields';

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
          <LocationFields form={form} />
          <TimelineFields form={form} />
        </div>
      </Form>
    </div>
  );
};

export default LocationTimelineStep;
