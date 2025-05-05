import React, { useState, useEffect, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { EntryData, useEntries } from '@/hooks/useEntries';
import { EntryCard } from './EntryCard';
import { EntryActionModal } from './EntryActionModal';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface EntryListProps {
  projectId: string;
  projectName?: string;
}

type EntryGroup = {
  date: string;
  entries: EntryData[];
};

export const EntryList: React.FC<EntryListProps> = ({ 
  projectId,
  projectName = 'Current Project' 
}) => {
  const { 
    loading, 
    getEntriesByProject, 
    createEntry, 
    updateEntry,
    deleteEntry,
    splitEntry,
    restoreEntry 
  } = useEntries();
  
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<EntryData | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDeleted, setShowDeleted] = useState(false);
  
  // Load entries for the project
  useEffect(() => {
    const loadEntries = async () => {
      if (!projectId) return;
      
      const projectEntries = await getEntriesByProject(projectId, showDeleted);
      setEntries(projectEntries);
    };
    
    loadEntries();
  }, [projectId, showDeleted]);
  
  // Filter entries based on search term, status, and deleted state
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = 
        searchTerm === '' || 
        entry.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.notes && entry.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (entry.floor && entry.floor.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesStatus = 
        statusFilter === 'all' || 
        entry.status === statusFilter;
      
      // Always include non-deleted entries, only include deleted if showDeleted is true
      const matchesDeletedFilter = entry.status !== 'deleted' || showDeleted;
        
      return matchesSearch && matchesStatus && matchesDeletedFilter;
    });
  }, [entries, searchTerm, statusFilter, showDeleted]);

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups: { [key: string]: EntryData[] } = {};
    
    filteredEntries.forEach(entry => {
      // Format date as YYYY-MM-DD
      const dateKey = entry.created_at 
        ? format(parseISO(entry.created_at), 'yyyy-MM-dd') 
        : 'Unknown Date';
        
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(entry);
    });
    
    // Convert to array and sort by date (newest first)
    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map(date => ({
        date,
        entries: groups[date]
      }));
  }, [filteredEntries]);

  // Handle create entry
  const handleCreateEntry = async (entryData: EntryData) => {
    const newEntry = await createEntry(entryData);
    if (newEntry) {
      setEntries(prev => [newEntry, ...prev]);
    }
  };

  // Handle edit entry
  const handleEditEntry = async (entryData: EntryData) => {
    if (!entryData.id) return;
    
    const updatedEntry = await updateEntry(entryData.id, entryData);
    if (updatedEntry) {
      setEntries(prev => 
        prev.map(entry => 
          entry.id === updatedEntry.id ? updatedEntry : entry
        )
      );
    }
  };

  // Handle delete entry
  const handleDeleteEntry = async (id: string) => {
    const success = await deleteEntry(id);
    if (success) {
      // If showing deleted entries, get fresh entries that include the newly deleted one
      if (showDeleted) {
        const updatedEntries = await getEntriesByProject(projectId, true);
        setEntries(updatedEntries);
      } else {
        // Otherwise, just remove the entry from the list
        setEntries(prev => prev.filter(entry => entry.id !== id));
      }
    }
    setConfirmDelete(null);
  };

  // Handle restore entry
  const handleRestoreEntry = async (id: string) => {
    const restoredEntry = await restoreEntry(id);
    if (restoredEntry) {
      setEntries(prev => 
        prev.map(entry => 
          entry.id === id ? restoredEntry : entry
        )
      );
    }
  };

  // Handle split entry
  const handleSplitEntry = async (
    originalData: Partial<EntryData>, 
    newEntryData: EntryData
  ) => {
    if (!selectedEntry?.id) return;
    
    const { updatedOriginal, newEntry } = await splitEntry(
      selectedEntry.id,
      originalData,
      newEntryData
    );
    
    if (updatedOriginal && newEntry) {
      // Update the list with both entries
      setEntries(prev => {
        const updatedList = prev.filter(entry => entry.id !== selectedEntry.id);
        if (newEntry) updatedList.unshift(newEntry);
        
        // Get the updated original entry
        const originalUpdated = {
          ...selectedEntry,
          ...originalData,
          quantity: originalData.quantity || 0
        };
        
        updatedList.unshift(originalUpdated as EntryData);
        return updatedList;
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{projectName} - Measurements</h2>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Measurement
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search measurements..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="measured">Measured</SelectItem>
            <SelectItem value="cut">Cut</SelectItem>
            <SelectItem value="installed">Installed</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            {showDeleted && <SelectItem value="deleted">Deleted</SelectItem>}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Switch 
            id="show-deleted"
            checked={showDeleted}
            onCheckedChange={setShowDeleted}
          />
          <Label htmlFor="show-deleted" className="flex items-center gap-2">
            {showDeleted ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Deleted
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Deleted
              </>
            )}
          </Label>
        </div>
      </div>

      {/* Loading state */}
      {loading && <div className="text-center py-8">Loading measurements...</div>}

      {/* No results */}
      {!loading && groupedEntries.length === 0 && (
        <div className="text-center py-8 border border-dashed border-zinc-700 rounded-md">
          <p className="text-zinc-400">No measurements found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create your first measurement
          </Button>
        </div>
      )}

      {/* Display entries grouped by date */}
      {groupedEntries.map(group => (
        <div key={group.date} className="mb-6">
          <h3 className="text-lg font-medium mb-4 border-b border-zinc-700 pb-2">
            {format(parseISO(group.date), 'MMMM d, yyyy')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.entries.map(entry => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={(entry) => {
                  setSelectedEntry(entry);
                  setIsEditModalOpen(true);
                }}
                onSplit={(entry) => {
                  setSelectedEntry(entry);
                  setIsEditModalOpen(true);
                }}
                onDelete={(id) => setConfirmDelete(id)}
                onRestore={entry.status === 'deleted' ? handleRestoreEntry : undefined}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Create Entry Modal */}
      <EntryActionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectId}
        onSave={handleCreateEntry}
        title="Add New Measurement"
      />

      {/* Edit/Split Entry Modal */}
      <EntryActionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEntry(undefined);
        }}
        projectId={projectId}
        entry={selectedEntry}
        onSave={handleEditEntry}
        onSplit={handleSplitEntry}
        title="Edit Measurement"
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete this measurement entry. You can restore it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete && handleDeleteEntry(confirmDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
