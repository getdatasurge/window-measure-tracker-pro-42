
import React from 'react';
import { Label } from "@/components/ui/label";

const AuditSection: React.FC = () => {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-4 rounded-full bg-green-500"></div>
        <h3 className="text-sm font-medium text-white">Audit Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm text-zinc-400">
            Created By
          </Label>
          <p className="text-sm text-zinc-300">John Installer</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm text-zinc-400">
            Created At
          </Label>
          <p className="text-sm text-zinc-300">May 4, 2025 7:54 PM</p>
        </div>
      </div>
    </div>
  );
};

export default AuditSection;
