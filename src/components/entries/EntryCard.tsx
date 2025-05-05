
import React from 'react';
import { EntryData } from '@/types/entries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Split, Trash, RefreshCw } from 'lucide-react';

interface EntryCardProps {
  entry: EntryData;
  onEdit: (entry: EntryData) => void;
  onSplit?: (entry: EntryData) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  onEdit,
  onSplit,
  onDelete,
  onRestore
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'measured':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
      case 'cut':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20';
      case 'installed':
        return 'bg-green-500/20 text-green-500 border-green-500/20';
      case 'under_review':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/20';
      case 'deleted':
        return 'bg-red-500/20 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/20';
    }
  };

  // Calculate area
  const area = entry.width * entry.height;
  const formattedArea = (area / 144).toFixed(2); // Convert square inches to square feet

  // Check if entry is deleted
  const isDeleted = entry.status === 'deleted';

  return (
    <Card 
      className={`mb-4 border ${isDeleted 
        ? 'border-red-800/40 bg-red-900/10' 
        : 'border-zinc-800/70'}`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className={`text-base font-medium ${isDeleted ? 'text-zinc-400' : ''}`}>
              {entry.room}
            </h3>
            {entry.floor && (
              <p className="text-sm text-zinc-400">{entry.floor}</p>
            )}
          </div>
          <Badge className={getStatusColor(entry.status)}>{
            entry.status === 'measured' ? 'Measured' :
            entry.status === 'cut' ? 'Cut' :
            entry.status === 'installed' ? 'Installed' :
            entry.status === 'under_review' ? 'Under Review' : 
            entry.status === 'deleted' ? 'Deleted' :
            'Unknown'
          }</Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
          <div>
            <p className="text-zinc-400">Width</p>
            <p className={isDeleted ? 'text-zinc-500' : ''}>{entry.width}"</p>
          </div>
          <div>
            <p className="text-zinc-400">Height</p>
            <p className={isDeleted ? 'text-zinc-500' : ''}>{entry.height}"</p>
          </div>
          <div>
            <p className="text-zinc-400">Area</p>
            <p className={isDeleted ? 'text-zinc-500' : ''}>{formattedArea} ft²</p>
          </div>
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <div>
            <p className={`${isDeleted ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Quantity: {entry.quantity}
            </p>
          </div>
          <div>
            <p className={`${isDeleted ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {entry.film_required ? 'Film Required' : 'No Film Required'}
            </p>
          </div>
        </div>

        {entry.notes && (
          <div className="mt-2 text-sm">
            <p className="text-zinc-400">Notes:</p>
            <p className={isDeleted ? 'text-zinc-500' : 'text-zinc-300'}>{entry.notes}</p>
          </div>
        )}

        <div className="flex justify-end mt-3 space-x-2">
          {isDeleted && onRestore && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRestore(entry.id!)}
              className="h-8 text-green-500 hover:text-green-400 hover:bg-green-900/20"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Restore
            </Button>
          )}
          
          {!isDeleted && (
            <>
              {entry.quantity > 1 && onSplit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSplit(entry)}
                  className="h-8"
                >
                  <Split className="h-4 w-4 mr-1" />
                  Split
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(entry)}
                className="h-8"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(entry.id!)}
                className="h-8 text-red-500 hover:text-red-700 hover:bg-red-100/10"
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
