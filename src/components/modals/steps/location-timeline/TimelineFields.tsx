
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '../../CreateProjectModal';
import DatePickerField from './DatePickerField';

interface TimelineFieldsProps {
  form: UseFormReturn<ProjectFormValues>;
}

const TimelineFields: React.FC<TimelineFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-white">Timeline</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DatePickerField
          name="timeline.startDate"
          label="Start Date"
          description="When will the project begin?"
          placeholder="Pick a date"
          disabledDatePredicate={(date) => date < new Date("1900-01-01")}
          form={form}
          required={true}
        />
        
        <DatePickerField
          name="timeline.endDate"
          label="Expected End Date"
          description="When is the project expected to end?"
          placeholder="Pick a date"
          disabledDatePredicate={(date) => 
            date < new Date("1900-01-01") || 
            (form.getValues().timeline.startDate && date < new Date(form.getValues().timeline.startDate))
          }
          form={form}
        />

        <DatePickerField
          name="timeline.completionDate"
          label="Actual Completion"
          description="When was the project completed?"
          placeholder="Pick a date"
          disabledDatePredicate={(date) => 
            date < new Date("1900-01-01") || 
            (form.getValues().timeline.startDate && date < new Date(form.getValues().timeline.startDate))
          }
          form={form}
        />
      </div>
    </div>
  );
};

export default TimelineFields;
