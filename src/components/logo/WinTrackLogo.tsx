
import React from 'react';

const WinTrackLogo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="text-wintrack-dark-blue flex items-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-wintrack-dark-blue">
          <path d="M3 7H6L9 17H15L18 7H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 17H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="ml-2 text-lg font-semibold">WindowTracker</span>
        <span className="ml-1.5 w-2 h-2 rounded-full bg-green-500 mt-1"></span>
      </div>
    </div>
  );
};

export default WinTrackLogo;
