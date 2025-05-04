
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const DefaultProjectSettings = () => {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Default Project Settings</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="default-template" className="text-sm text-zinc-400 mb-1 block">
            Default Project Template
          </Label>
          <Select defaultValue="residential">
            <SelectTrigger id="default-template" className="bg-zinc-900/50 border-zinc-700 text-white">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="specialty">Specialty</SelectItem>
              <SelectItem value="blank">Blank Project</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="default-window-type" className="text-sm text-zinc-400 mb-1 block">
            Default Window Type
          </Label>
          <Select defaultValue="standard">
            <SelectTrigger id="default-window-type" className="bg-zinc-900/50 border-zinc-700 text-white">
              <SelectValue placeholder="Select window type" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
              <SelectItem value="specialty">Specialty</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Save Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DefaultProjectSettings;
