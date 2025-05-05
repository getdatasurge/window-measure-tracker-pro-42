import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MeasurementForm } from './MeasurementForm';
import { EntryData } from '@/types/entries';

interface EntryActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  entry?: EntryData;
  onSave: (data: EntryData) => Promise<void>;
  onSplit?: (originalData: Partial<EntryData>, newData: EntryData) => Promise<void>;
  title?: string;
}

export const EntryActionModal: React.FC<EntryActionModalProps> = ({
  isOpen,
  onClose,
  projectId,
  entry,
  onSave,
  onSplit,
  title = 'Measurement Entry'
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  
  const handleSave = async (data: EntryData) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSplit = async (splitEntryData: EntryData) => {
    if (!entry || !onSplit) return;
    
    setIsSubmitting(true);
    try {
      // Calculate quantities for split
      const originalQuantity = Math.max(1, entry.quantity - splitEntryData.quantity);
      
      // Update original entry with reduced quantity
      const originalUpdate: Partial<EntryData> = {
        ...entry,
        quantity: originalQuantity
      };
      
      await onSplit(originalUpdate, splitEntryData);
      onClose();
    } catch (error) {
      console.error('Error splitting entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare initial data for split form
  const splitInitialData = entry 
    ? {
        ...entry,
        quantity: Math.floor(entry.quantity / 2) // Default to half the quantity for split
      } 
    : undefined;
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        {entry && onSplit ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit Entry</TabsTrigger>
              <TabsTrigger value="split">Split Entry</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="pt-4">
              <MeasurementForm
                projectId={projectId}
                initialData={entry}
                onSubmit={handleSave}
                onCancel={onClose}
                isSubmitting={isSubmitting}
                submitLabel="Save Changes"
              />
            </TabsContent>
            
            <TabsContent value="split" className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Create a new entry with part of the original quantity.
                The original entry will keep the remaining quantity.
              </p>
              <MeasurementForm
                projectId={projectId}
                initialData={splitInitialData}
                onSubmit={handleSplit}
                onCancel={onClose}
                isSubmitting={isSubmitting}
                submitLabel="Split Entry"
              />
            </TabsContent>
          </Tabs>
        ) : (
          <MeasurementForm
            projectId={projectId}
            initialData={entry}
            onSubmit={handleSave}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
