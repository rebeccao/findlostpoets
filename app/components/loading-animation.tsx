// app/components/loading-animation.tsx

import React, { useState, useEffect } from 'react';

const LoadingAnimation: React.FC = () => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, 1500); // 1.5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (!showLoading) {
    return null; // Don't render anything until the delay is over
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="font-light text-center text-pearlwhite text-2xl">
        <span className="inline-block animate-loading-dots-1">L</span>
        <span className="inline-block animate-loading-dots-2">o</span>
        <span className="inline-block animate-loading-dots-3">a</span>
        <span className="inline-block animate-loading-dots-4">d</span>
        <span className="inline-block animate-loading-dots-5">i</span>
        <span className="inline-block animate-loading-dots-6">n</span>
        <span className="inline-block animate-loading-dots-7">g</span>
        <span className="inline-block animate-loading-dots-8">.</span>
        <span className="inline-block animate-loading-dots-1">.</span>
        <span className="inline-block animate-loading-dots-2">.</span>
      </div>
    </div>
  );
};

export default LoadingAnimation;