
import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Displays an error message when activity feed fails to load
 */
const ErrorState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
      <p className="text-sm text-zinc-400">Failed to load activity data</p>
      <button 
        className="mt-3 text-xs text-blue-400 hover:text-blue-300"
        onClick={() => window.location.reload()}
      >
        Try again
      </button>
    </div>
  );
};

export default ErrorState;
