import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WindowAction } from '@/lib/parseWindowActions';
import { searchActions, SearchResult } from '@/lib/searchActions';
import { FeatureArea } from '@/utils/assignFeatureArea';
import { useDebounce } from '@/hooks/useDebounce';
import ActionCard from './ActionCard';
import { Search } from 'lucide-react';

interface ActionSearchPanelProps {
  actions: WindowAction[];
  maxHeight?: string | number;
}

const ActionSearchPanel: React.FC<ActionSearchPanelProps> = ({
  actions,
  maxHeight = '70vh'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<FeatureArea | ''>('');
  const [selectedType, setSelectedType] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // ✅ Memoized: avoid state update loops
  const uniqueTypes = React.useMemo(() => {
    return Array.from(new Set(actions.map(action => action.type)));
  }, [actions]);

  const featureAreas = React.useMemo(() => {
    return Array.from(new Set(actions.map(action =>
      action.featureArea || 'general'
    ))) as FeatureArea[];
  }, [actions]);

  // Search logic with debounce and filters
  useEffect(() => {
    setIsSearching(true);

    const performSearch = () => {
      const results = searchActions(actions, debouncedQuery, {
        featureArea: selectedArea as FeatureArea || undefined,
        actionType: selectedType || undefined,
        minScore: 0.1
      });
      setSearchResults(results);
      setIsSearching(false);
    };

    const timeoutId = setTimeout(performSearch, 10);
    return () => clearTimeout(timeoutId);
  }, [debouncedQuery, selectedArea, selectedType, actions]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedArea('');
    setSelectedType('');
  };

  const handleAreaChange = (value: string) => {
    setSelectedArea(value as FeatureArea | '');
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
        <h2 className="text-lg font-medium mb-3">Search Actions</h2>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            disabled={!searchQuery && !selectedArea && !selectedType}
          >
            Clear
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Select value={selectedArea} onValueChange={handleAreaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by feature area" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Feature Areas</SelectLabel>
                <SelectItem value="">All Areas</SelectItem>
                {featureAreas.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by action type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Action Types</SelectLabel>
                <SelectItem value="">All Types</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="p-4" style={{ maxHeight }}>
        {isSearching ? (
          <div className="py-8 text-center text-gray-500">
            <div className="animate-pulse">Searching...</div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            {debouncedQuery ? (
              <p>No results match your search criteria</p>
            ) : (
              <p>Enter a search query to find actions</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-gray-500 mb-2">
              Found {searchResults.length} matching actions
            </div>

            {searchResults.map(result => (
              <div key={result.action.id} className="relative">
                <ActionCard action={{
                  ...result.action,
                  label: result.contextSnippet || result.action.label
                }} />
                <div className="absolute top-2 right-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {(result.matchScore * 100).toFixed(0)}% match
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ActionSearchPanel;
