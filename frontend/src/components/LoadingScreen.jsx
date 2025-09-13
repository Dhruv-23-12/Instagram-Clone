import { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-neutral-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-8">
          <img 
            src="/assets/ppsu-logo.svg" 
            alt="PPSU Logo" 
            className="h-20 w-20 mx-auto animate-pulse"
          />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          PPSU Social
        </h2>
        <p className="text-neutral-600 mb-4">
          P P Savani University
        </p>
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="text-neutral-600">Loading{dots}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
