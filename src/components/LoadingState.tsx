interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'pulse';
  message?: string;
}

export function LoadingState({ type = 'spinner', message }: LoadingStateProps) {
  if (type === 'spinner') {
    return (
      <div 
        className="flex flex-col items-center justify-center p-12"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
        {message && (
          <p className="mt-6 text-sm text-gray-700 font-medium">{message}</p>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div 
        className="animate-pulse space-y-6 p-6"
        role="status"
        aria-live="polite"
        aria-label="Loading content"
      >
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-3/4 shadow-sm"></div>
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-1/2 shadow-sm"></div>
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-5/6 shadow-sm"></div>
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-2/3 shadow-sm"></div>
        {message && (
          <p className="mt-6 text-sm text-gray-700 font-medium">{message}</p>
        )}
        <span className="sr-only">Loading content...</span>
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div 
        className="flex items-center justify-center p-12"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <div className="flex space-x-3">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce shadow-lg"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
        </div>
        {message && (
          <p className="ml-6 text-sm text-gray-700 font-medium">{message}</p>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return null;
}
