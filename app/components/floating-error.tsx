import React, { useEffect, useRef, useState } from 'react';

interface FloatingErrorProps {
  message: string;
  onClose: () => void;
}

export const FloatingError: React.FC<FloatingErrorProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setVisible(false); // Hide on outside click
      onClose(); // Additional handler if needed
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!visible) return null;

  return (
    <div ref={ref} className="absolute z-20 left-5 font-normal top-full mt-2 p-2 bg-lightmedgray border-l-4 border-deepCrimson text-verydarkgray rounded-md">
      {message}
    </div>
  );
};
