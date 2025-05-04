
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Measurement, MeasurementStatus } from '@/data/measurementsData';

interface EditMeasurementModalProps {
  measurement: Measurement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (measurement: Measurement) => void;
}

const directions = ['North', 'South', 'East', 'West', 'N/A'];
const statuses: MeasurementStatus[] = ['Pending', 'Film Cut', 'Installed', 'Under Review', 'Completed'];

const EditMeasurementModal: React.FC<EditMeasurementModalProps> = ({
  measurement,
  open,
  onOpenChange,
  onSave,
}) => {
  const [editedMeasurement, setEditedMeasurement] = useState<Measurement | null>(null);

  useEffect(() => {
    if (measurement) {
      setEditedMeasurement({ ...measurement });
    }
  }, [measurement]);

  const handleChange = (field: string, value: string | number) => {
    if (!editedMeasurement) return;
    
    setEditedMeasurement({
      ...editedMeasurement,
      [field]: value,
    });
  };

  const handleSave = () => {
    if (!editedMeasurement) return;
    
    // Update the updated timestamp
    const updatedMeasurement = {
      ...editedMeasurement,
      updatedAt: new Date().toISOString(),
    };
    
    onSave(updatedMeasurement);
    onOpenChange(false);
  };

  if (!editedMeasurement) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border border-zinc-800 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Measurement {editedMeasurement.id}
            <Badge className="ml-2">{editedMeasurement.status}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <Label htmlFor="projectName">Project</Label>
            <Input
              id="projectName"
              value={editedMeasurement.projectName}
              onChange={(e) => handleChange('projectName', e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={editedMeasurement.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          
          <div>
            <Label htmlFor="recordedBy">Recorded By</Label>
            <Input
              id="recordedBy"
              value={editedMeasurement.recordedBy}
              onChange={(e) => handleChange('recordedBy', e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          
          <div>
            <Label htmlFor="measurementDate">Measurement Date</Label>
            <Input
              id="measurementDate"
              type="date"
              value={editedMeasurement.measurementDate}
              onChange={(e) => handleChange('measurementDate', e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          
          <div>
            <Label htmlFor="width">Width (inches)</Label>
            <Input
              id="width"
              value={editedMeasurement.width.replace('"', '')}
              onChange={(e) => handleChange('width', `${e.target.value}"`)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          
          <div>
            <Label htmlFor="height">Height (inches)</Label>
            <Input
              id="height"
              value={editedMeasurement.height.replace('"', '')}
              onChange={(e) => handleChange('height', `${e.target.value}"`)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={editedMeasurement.quantity}
              onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          
          <div>
            <Label htmlFor="direction">Direction</Label>
            <Select 
              value={editedMeasurement.direction} 
              onValueChange={(value) => handleChange('direction', value)}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {directions.map(direction => (
                  <SelectItem key={direction} value={direction}>{direction}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={editedMeasurement.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={editedMeasurement.status} 
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {editedMeasurement.status === 'Completed' && (
            <div>
              <Label htmlFor="approvalBy">Approval By</Label>
              <Input
                id="approvalBy"
                value={editedMeasurement.approvalBy || ''}
                onChange={(e) => handleChange('approvalBy', e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <p className="text-xs text-zinc-500">Created: {new Date(editedMeasurement.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Last Updated: {new Date(editedMeasurement.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMeasurementModal;
