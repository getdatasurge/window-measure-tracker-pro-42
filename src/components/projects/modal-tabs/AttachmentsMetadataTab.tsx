
import React from 'react';
import { ProjectFormData } from '@/types/project';
import AttachmentsSection from './AttachmentsSection';
import MetadataSection from './MetadataSection';
import AuditSection from './AuditSection';

interface AttachmentsMetadataTabProps {
  formData: ProjectFormData;
  updateFormData: (field: string, value: any) => void;
  errors: Partial<Record<string, string>>;
}

const AttachmentsMetadataTab: React.FC<AttachmentsMetadataTabProps> = ({ 
  formData, 
  updateFormData,
  errors
}) => {
  return (
    <div className="space-y-6">
      {/* Attachments Section */}
      <AttachmentsSection formData={formData} updateFormData={updateFormData} />
      
      {/* Additional Metadata Section */}
      <MetadataSection formData={formData} updateFormData={updateFormData} />
      
      {/* Audit Information Section */}
      <AuditSection />
    </div>
  );
};

export default AttachmentsMetadataTab;
