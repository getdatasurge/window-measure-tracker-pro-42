
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface GlobalSearchProps {
  className?: string;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Add keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        const searchInput = document.getElementById('global-search');
        if (searchInput) searchInput.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Add any additional search logic here
  };
  
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      <Input
        id="global-search"
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={handleChange}
        className="pl-9 h-9 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-300 w-full md:w-64"
        aria-label="Search"
      />
    </div>
  );
};

export default GlobalSearch;
