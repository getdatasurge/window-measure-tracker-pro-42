
import React from 'react';
import { Measurement } from '@/types/measurement';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Calendar, MapPin, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MeasurementCardProps {
  measurement: Measurement;
  onEdit: (measurement: Measurement) => void;
  onView?: (measurement: Measurement) => void;
}

const getBadgeColor = (status: string) => {
  switch(status) {
    case 'Pending': return 'bg-amber-500/20 text-amber-500 border-amber-500/20';
    case 'Film Cut': return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
    case 'Installed': return 'bg-green-500/20 text-green-500 border-green-500/20';
    case 'Under Review': return 'bg-purple-500/20 text-purple-500 border-purple-500/20';
    case 'Completed': return 'bg-green-500/20 text-green-500 border-green-500/20';
    default: return 'bg-gray-500/20 text-gray-500 border-gray-500/20';
  }
};

const MeasurementCard: React.FC<MeasurementCardProps> = ({ measurement, onEdit, onView }) => {
  const {
    id,
    projectName,
    location,
    recordedBy,
    measurementDate,
    width,
    height,
    area,
    quantity,
    direction,
    notes,
    status,
    approvalBy,
    updatedAt
  } = measurement;
  
  const formattedDate = new Date(measurementDate).toLocaleDateString();
  const formattedUpdatedAt = new Date(updatedAt).toLocaleString();
  
  return (
    <Card className="mb-4 border border-zinc-800/70">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{id}</span>
            <Badge className={getBadgeColor(status)}>{status}</Badge>
          </div>
          <div className="flex gap-1">
            {onView && (
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onView(measurement)}>
                <Eye size={14} />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onEdit(measurement)}>
              <Edit size={14} />
            </Button>
          </div>
        </div>
        
        <h3 className="text-sm font-semibold mb-2 text-white">{projectName}</h3>
        
        <div className="grid grid-cols-1 gap-2 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <MapPin size={12} />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <User size={12} />
            <span>{recordedBy}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar size={12} />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-3 gap-1 text-xs border-t border-zinc-800/50 pt-2">
          <div>
            <div className="text-zinc-500">Width</div>
            <div className="font-medium text-white">{width}</div>
          </div>
          <div>
            <div className="text-zinc-500">Height</div>
            <div className="font-medium text-white">{height}</div>
          </div>
          <div>
            <div className="text-zinc-500">Area</div>
            <div className="font-medium text-white">{area}</div>
          </div>
        </div>
        
        <div className="mt-2 flex justify-between text-xs">
          <div className="text-zinc-400">Qty: {quantity}</div>
          <div className="text-zinc-400">Direction: {direction}</div>
        </div>
        
        {notes && (
          <div className="mt-2 text-xs border-t border-zinc-800/50 pt-2">
            <div className="text-zinc-500">Notes:</div>
            <div className="text-zinc-300">{notes}</div>
          </div>
        )}
        
        {approvalBy && (
          <div className="mt-2 text-xs border-t border-zinc-800/50 pt-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              Approved by {approvalBy}
            </Badge>
          </div>
        )}
        
        <div className="mt-2 text-xs flex items-center text-zinc-500">
          <Clock size={10} className="mr-1" />
          <span>Updated: {formattedUpdatedAt}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeasurementCard;
