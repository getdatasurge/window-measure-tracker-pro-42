
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapPin, Users, File } from "lucide-react";
import ProjectInfoTab from './modal-tabs/ProjectInfoTab';
import LocationTimelineTab from './modal-tabs/LocationTimelineTab';
import TeamRequirementsTab from './modal-tabs/TeamRequirementsTab';
import AttachmentsMetadataTab from './modal-tabs/AttachmentsMetadataTab';
import { ProjectFormData } from '@/types/project';
import { motion } from 'framer-motion';

export interface ProjectModalContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: ProjectFormData;
  errors: Partial<Record<string, string>>;
  projectId: string;
  updateFormData: (field: string, value: any) => void;
  handleSubmit: () => void;
}

const ProjectModalContent: React.FC<ProjectModalContentProps> = ({
  activeTab,
  setActiveTab,
  formData,
  errors,
  projectId,
  updateFormData,
  handleSubmit
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="border-b border-zinc-800">
        <TabsList className="bg-transparent h-auto p-0">
          <TabsTrigger 
            value="project-info" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-6 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
          >
            Project Info
          </TabsTrigger>
          <TabsTrigger 
            value="location-timeline" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-6 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
          >
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Location & Timeline</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="team-requirements" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-6 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
          >
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Team & Requirements</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="attachments-metadata" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white px-6 py-3 bg-transparent rounded-none text-sm font-medium text-zinc-400 data-[state=active]:shadow-none"
          >
            <div className="flex items-center gap-1">
              <File className="h-4 w-4" />
              <span>Attachments & Metadata</span>
            </div>
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="p-6">
        {/* Using motion.div to animate tab transitions */}
        <TabsContent value="project-info" className="m-0">
          <motion.div
            key="project-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ProjectInfoTab 
              formData={formData} 
              updateFormData={updateFormData} 
              errors={errors}
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="location-timeline" className="m-0">
          <motion.div
            key="location-timeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <LocationTimelineTab 
              formData={formData} 
              updateFormData={updateFormData} 
              errors={errors}
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="team-requirements" className="m-0">
          <motion.div
            key="team-requirements"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TeamRequirementsTab 
              formData={formData} 
              updateFormData={updateFormData} 
              errors={errors}
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="attachments-metadata" className="m-0">
          <motion.div
            key="attachments-metadata"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AttachmentsMetadataTab 
              formData={formData} 
              updateFormData={updateFormData} 
              errors={errors}
            />
          </motion.div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ProjectModalContent;
