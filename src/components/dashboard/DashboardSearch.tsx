
import React from 'react';

const DashboardSearch: React.FC = () => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search projects..."
        className="search-input"
      />
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
      </div>
    </div>
  );
};

export default DashboardSearch;
