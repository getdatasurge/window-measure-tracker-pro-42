
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import CreateProjectButton from './CreateProjectButton';

const ProjectHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <p className="text-sm text-zinc-400">Manage and track all your window projects</p>
      </div>
      
      <CreateProjectButton 
        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
      />
    </div>
  );
};

export default ProjectHeader;
