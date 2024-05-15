import React, { useState, useEffect } from 'react';
import { GrClose } from "react-icons/gr";
import { ImageSize } from './poetdetail';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageSize: ImageSize;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageSrc, imageSize }) => {
  // Constants for initial and minimum scales based on image size
  const initialScale = 1;                           // Start at full size for 1X, half for 2X
  const minScale = imageSize === '2X' ? 0.5 : 1;    // Minimum scale for 2X is 0.5 (1024px view)

  const [showModal, setShowModal] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [scale, setScale] = useState(initialScale);


  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);  // Render the modal
      setTimeout(() => setShowModal(true), 10); // Slightly delay setting showModal to true to ensure CSS transition occurs
      setScale(initialScale);
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

  const handleZoomIn = () => setScale(scale => scale * 1.25);                       // Increase scale
  const handleZoomOut = () => setScale(scale => Math.max(scale / 1.25, minScale));  // Do not zoom out beyond 1024x1024 equivalent

  if (!shouldRender) return null;

  return (
    <div className={`image-container fixed inset-0 bg-closetoblack flex justify-center items-center z-50 transition-opacity ease-in-out duration-1000 ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div style={{ transform: `scale(${scale})` }} className="flex flex-col items-center w-full h-full overflow-auto">
        <img src={imageSrc} alt="Enlarged view" className={`${imageSize === '2X' ? "zoomed-img" : "normal-img"} transition-transform duration-300 cursor-pointer`} />
      </div>
      <div className="absolute top-5 left-5 flex space-x-2">
        <button onClick={onClose} className="text-pearlwhite text-3xl">
          <GrClose/>
        </button>
        <button onClick={handleZoomOut} className="bg-pearlwhite p-2 rounded-full text-black">-</button>
        <button onClick={handleZoomIn} className="bg-pearlwhite p-2 rounded-full text-black">+</button>
      </div>
    </div>
  );
};

export default ImageModal;
