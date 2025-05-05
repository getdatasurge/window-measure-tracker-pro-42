
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProjectFormValues } from '../../project-form/validation-schema';
import DatePickerField from './DatePickerField';
import { FormGrid, FormSection } from '../../form-layout';

interface TimelineFieldsProps {
  form: UseFormReturn<ProjectFormValues>;
}

const TimelineFields: React.FC<TimelineFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormSection title="Timeline">
        <FormGrid columns={3}>
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
        </FormGrid>
      </FormSection>
    </div>
  );
};

export default TimelineFields;
