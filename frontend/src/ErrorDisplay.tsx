import React from 'react';
import { useError } from './ErrorContext';

const ErrorDisplay: React.FC = () => {
  const { error, clearError } = useError();

  if (!error) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-red-500 text-white p-4 z-50">
      <p>{error}</p>
      <button 
        onClick={clearError}
        className="absolute top-2 right-2 text-white"
      >
        ×
      </button>
    </div>
  );
};

export default ErrorDisplay;