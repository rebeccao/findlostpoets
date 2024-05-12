import React, { useState, useEffect } from 'react';
import { GrClose } from "react-icons/gr";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageSrc }) => {
  const [showModal, setShowModal] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true); // Render the modal
      setTimeout(() => setShowModal(true), 10); // Slightly delay setting showModal to true to ensure CSS transition occurs
    } else {
      setShowModal(false); // Start the opacity transition immediately
      setTimeout(() => setShouldRender(false), 1000); // Remove from DOM after the transition
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 bg-black flex justify-center items-center z-50 transition-opacity ease-in-out duration-1000 ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <button onClick={onClose} className="absolute top-5 left-5 text-white text-3xl">
        <GrClose/>
      </button>
      <img src={imageSrc} alt="Full screen modal view" className="max-w-full max-h-full" />
    </div>
  );
};

export default ImageModal;
