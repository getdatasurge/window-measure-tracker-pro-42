
import React from 'react';

interface DashboardPaginationProps {
  totalCount: number;
  visibleCount: number;
}

const DashboardPagination: React.FC<DashboardPaginationProps> = ({
  totalCount,
  visibleCount
}) => {
  // Only show pagination if we have more than a few items
  if (totalCount <= 5) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <button className="pagination-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button className="pagination-button active">1</button>
      <button className="pagination-button">2</button>
      <button className="pagination-button">3</button>
      <button className="pagination-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  );
};

export default DashboardPagination;
