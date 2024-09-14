import React from 'react';
import { useMessage } from './MessageContext';

const MessageDisplay: React.FC = () => {
  const { error, success, clearMessages } = useMessage();

  if (!error && !success) return null;

  return (
    <div className={`fixed top-0 left-0 w-full p-4 z-50 ${error ? 'bg-red-500' : 'bg-green-500'} text-white`}>
      <p>{error || success}</p>
      <button 
        onClick={clearMessages}
        className="absolute top-2 right-2 text-white"
      >
        ×
      </button>
    </div>
  );
};

export default MessageDisplay;