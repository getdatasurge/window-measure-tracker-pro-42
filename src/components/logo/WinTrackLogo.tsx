
import React from 'react';

const WinTrackLogo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="w-7 h-7 rounded bg-wintrack-green flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white">
          <path d="M3 7L9 13L13 9L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 17H21V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="ml-2 text-lg font-semibold text-white">WinTrack</span>
    </div>
  );
};

export default WinTrackLogo;
