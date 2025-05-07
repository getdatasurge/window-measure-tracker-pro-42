
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import MeasurementDetailsTab from '../tabs/MeasurementDetailsTab';
import DimensionsTab from '../tabs/DimensionsTab';
import AttributesTab from '../tabs/AttributesTab';
import PhotosTab from '../tabs/PhotosTab';
import StatusWorkflowTab from '../tabs/StatusWorkflowTab';
import { Measurement } from '@/types/measurement';

interface MeasurementTabsContentProps {
  activeTab: string;
  formData: Measurement;
  updateFormData: (field: string, value: any) => void;
  errors: {[key: string]: string};
  setErrors: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
}

const MeasurementTabsContent: React.FC<MeasurementTabsContentProps> = ({
  activeTab,
  formData,
  updateFormData,
  errors,
  setErrors
}) => {
  return (
    <div className="p-6">
      <TabsContent value="details" className="m-0">
        <MeasurementDetailsTab 
          formData={formData} 
          updateFormData={updateFormData}
          errors={errors}
          setErrors={setErrors}
        />
      </TabsContent>
      <TabsContent value="dimensions" className="m-0">
        <DimensionsTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      </TabsContent>
      <TabsContent value="attributes" className="m-0">
        <AttributesTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      </TabsContent>
      <TabsContent value="photos" className="m-0">
        <PhotosTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      </TabsContent>
      <TabsContent value="status" className="m-0">
        <StatusWorkflowTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      </TabsContent>
    </div>
  );
};

export default MeasurementTabsContent;
