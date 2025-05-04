
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SidebarSearchProps {
  collapsed: boolean;
}

const SidebarSearch: React.FC<SidebarSearchProps> = ({ collapsed }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  if (collapsed) {
    return (
      <div className="px-2 my-2">
        <button className="w-full h-8 flex items-center justify-center text-zinc-400 bg-zinc-800/50 rounded-md hover:bg-zinc-800 hover:text-zinc-300 transition-colors">
          <Search size={16} />
        </button>
      </div>
    );
  }
  
  return (
    <div className="px-4 my-2">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full h-8 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-sm rounded-md pl-8 pr-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          value={searchTerm}
          onChange={handleChange}
        />
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <Search size={14} className="text-zinc-500" />
        </div>
      </div>
    </div>
  );
};

export default SidebarSearch;
