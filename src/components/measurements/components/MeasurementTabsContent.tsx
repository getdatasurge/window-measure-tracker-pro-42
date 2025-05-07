
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import MeasurementDetailsTab from '../tabs/MeasurementDetailsTab';
import DimensionsTab from '../tabs/DimensionsTab';
import PhotosTab from '../tabs/PhotosTab';
import StatusWorkflowTab from '../tabs/StatusWorkflowTab';
import AttributesTab from '../tabs/AttributesTab';
import { MeasurementFormData } from '@/hooks/measurements/types';

interface MeasurementTabsContentProps {
  activeTab: string;
  formData: MeasurementFormData;
  updateFormData: (field: string, value: any) => void;
  errors?: {[key: string]: string};
  setErrors?: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
}

const MeasurementTabsContent: React.FC<MeasurementTabsContentProps> = ({
  activeTab,
  formData,
  updateFormData,
  errors = {},
  setErrors = () => {}
}) => {
  return (
    <div className="mt-2">
      <TabsContent value="details" className={activeTab === 'details' ? 'block' : 'hidden'}>
        <MeasurementDetailsTab 
          formData={formData}
          updateFormData={updateFormData}
          errors={errors}
          setErrors={setErrors}
        />
      </TabsContent>
      
      <TabsContent value="dimensions" className={activeTab === 'dimensions' ? 'block' : 'hidden'}>
        <DimensionsTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      </TabsContent>
      
      <TabsContent value="attributes" className={activeTab === 'attributes' ? 'block' : 'hidden'}>
        <AttributesTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      </TabsContent>
      
      <TabsContent value="photos" className={activeTab === 'photos' ? 'block' : 'hidden'}>
        <PhotosTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      </TabsContent>
      
      <TabsContent value="workflow" className={activeTab === 'workflow' ? 'block' : 'hidden'}>
        <StatusWorkflowTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      </TabsContent>
    </div>
  );
};

export default MeasurementTabsContent;
