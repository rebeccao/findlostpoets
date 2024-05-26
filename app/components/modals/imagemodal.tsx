import React, { useState, useEffect } from 'react';
import { GrClose } from "react-icons/gr";
import { ImageSize } from './poetmodal';
import { HiOutlineMagnifyingGlassPlus, HiOutlineMagnifyingGlassMinus } from "react-icons/hi2";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageSize: ImageSize;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageSrc, imageSize }) => {
  // Constants for initial and minimum scales based on image size
  const minScale = imageSize === '2X' ? 0.5 : 1;    // Minimum scale for 2X is 0.5 (1024px view)

  const [showModal, setShowModal] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [scale, setScale] = useState(1);


  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);  // Render the modal
      setTimeout(() => setShowModal(true), 10); // Slightly delay setting showModal to true to ensure CSS transition occurs
      setScale(1); 
    } else {
      setShowModal(false); // Start the opacity transition immediately
      setTimeout(() => setShouldRender(false), 1000); // Remove from DOM after the transition
    }
  }, [isOpen, imageSize]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleZoomIn = () => setScale(scale => Math.min(scale * 1.25, 2));
  const handleZoomOut = () => setScale(scale => Math.max(scale / 1.25, 1)); 

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 bg-closetoblack flex justify-center items-center z-50 overflow-auto transition-opacity ease-in-out duration-1000 ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div style={{ transform: `scale(${scale})` }} className="relative w-full max-w-[1024px] h-full max-h-[1024px] overflow-hidden transition-transform duration-300 cursor-pointer">
        <img src={imageSrc} alt="Enlarged view" className="w-full h-auto object-contain" />
      </div>
      <div className="fixed top-5 left-5 flex space-x-2">
        <button onClick={onClose} className="text-pearlwhite text-3xl">
          <GrClose/>
        </button>
        <button onClick={handleZoomOut} className="text-pearlwhite text-4xl">
          <HiOutlineMagnifyingGlassMinus/>
        </button>
        <button onClick={handleZoomIn} className="text-pearlwhite text-4xl">
          <HiOutlineMagnifyingGlassPlus/>
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
