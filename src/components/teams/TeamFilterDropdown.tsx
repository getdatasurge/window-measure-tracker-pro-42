
import React from 'react';
import { Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterOption {
  label: string;
  value: string;
}

interface TeamFilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

const TeamFilterDropdown: React.FC<TeamFilterDropdownProps> = ({
  label,
  options,
  selectedValue,
  onSelect
}) => {
  const selectedOption = options.find(option => option.value === selectedValue);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300 flex gap-2 items-center">
          <Filter size={14} />
          <span>{label}</span>
          {selectedOption && selectedValue !== 'all' && (
            <Badge variant="secondary" className="bg-zinc-700 text-xs ml-1 font-normal">
              {selectedOption.label}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-zinc-800 border border-zinc-700 text-zinc-300">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`${selectedValue === option.value ? 'bg-zinc-700' : ''} hover:bg-zinc-700 cursor-pointer`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamFilterDropdown;
