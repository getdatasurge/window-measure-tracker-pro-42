
import React from 'react';

interface DashboardPaginationProps {
  totalCount: number;
  visibleCount: number;
}

const DashboardPagination: React.FC<DashboardPaginationProps> = ({ totalCount, visibleCount }) => {
  return (
    <div className="mt-4 flex justify-between items-center">
      <div className="text-sm text-gray-500">
        Showing {visibleCount} of {totalCount} projects
      </div>
      <div className="flex space-x-1">
        <button className="pagination-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button className="pagination-button active">1</button>
        <button className="pagination-button">2</button>
        <button className="pagination-button">3</button>
        <button className="pagination-button">4</button>
        <button className="pagination-button">5</button>
        <button className="pagination-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
};

export default DashboardPagination;
