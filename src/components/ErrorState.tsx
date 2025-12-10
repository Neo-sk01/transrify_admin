'use client';

import { useState } from 'react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  details?: string;
}

export function ErrorState({ message, onRetry, details }: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div 
      className="flex flex-col items-center justify-center p-10 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-300 shadow-lg"
      role="alert"
      aria-live="assertive"
    >
      {/* Error Icon */}
      <div className="flex items-center justify-center w-16 h-16 bg-red-200 rounded-full mb-6 shadow-md animate-pulse">
        <svg
          className="w-8 h-8 text-red-700"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      {/* Error Message */}
      <h3 className="text-xl font-bold text-red-900 mb-3">
        Error
      </h3>
      <p className="text-sm text-red-800 text-center mb-6 max-w-md font-medium">
        {message}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[44px] min-w-[44px] font-semibold"
            aria-label="Retry failed operation"
          >
            Retry
          </button>
        )}
        
        {details && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-6 py-3 bg-white text-red-700 border-2 border-red-400 rounded-lg hover:bg-red-50 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[44px] min-w-[44px] font-semibold"
            aria-expanded={showDetails}
            aria-controls="error-details"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        )}
      </div>

      {/* Error Details */}
      {details && showDetails && (
        <div 
          id="error-details"
          className="mt-6 p-5 bg-white rounded-lg border-2 border-red-300 w-full max-w-2xl shadow-md animate-fadeIn"
        >
          <h4 className="text-sm font-bold text-red-900 mb-3">Error Details:</h4>
          <pre className="text-xs text-red-800 overflow-x-auto whitespace-pre-wrap font-mono">
            {details}
          </pre>
        </div>
      )}
    </div>
  );
}
