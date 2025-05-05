
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateProjectModal from '../modals/CreateProjectModal';
import { ProjectFormData } from '@/types/project';
import { toast } from '@/hooks/use-toast';

interface CreateProjectButtonProps {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  defaultValues?: Partial<ProjectFormData>;
  submitButtonText?: string;
}

const CreateProjectButton: React.FC<CreateProjectButtonProps> = ({ 
  variant = "default", 
  size = "default", 
  className = "",
  defaultValues,
  submitButtonText
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleCreateProject = (data: ProjectFormData) => {
    // In a real app, this would call an API to save the project
    console.log("Creating project with data:", data);
    
    // Show a success toast
    toast({
      title: "Project Created Successfully",
      description: `Project ${data.name} has been created.`,
    });
  };
  
  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className={className}
        variant={variant}
        size={size}
      >
        <Plus className="mr-1 h-4 w-4" /> Create New Project
      </Button>
      
      <CreateProjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCreateProject={handleCreateProject}
        submitButtonText={submitButtonText}
      />
    </>
  );
};

export default CreateProjectButton;
