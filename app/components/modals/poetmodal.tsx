import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import type { Poet } from '@prisma/client';
import PoetDetailNavbar from '~/components/navbar-poet-detail';
import PoetModalTraits from '~/components/modals/poetmodal-traits';
import ImageModal from './imagemodal'; 
import { GrClose } from "react-icons/gr";

interface PoetModalProps {
  poet: Poet;
  hasPoem: boolean;
  onReturn: () => void;
  isStandalone?: boolean;   // Is poet details called by _index in a modal or stand alone called by the user
}

export type ImageSize = '1X' | '2X';

// Display Poet's details. The poem m
export default function PoetModal({ poet, hasPoem, onReturn, isStandalone }: PoetModalProps) {
  const [showPoemModal, setShowPoemModal] = useState(false);
  const [isPoemOverflowing, setIsPoemOverflowing] = useState(false);
  const poemContainerRef = useRef<HTMLDivElement>(null);
  const togglePoemModal = () => setShowPoemModal(!showPoemModal);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState<string>('');
  const [imageSize, setImageSize] = useState<ImageSize>('1X');
  const [containerDimensions, setContainerDimensions] = useState({ height: '75vh', width: '50%' });
  const [isVisible, setIsVisible] = useState(false);    // Controls opacity/scale animation of PoetModal fade-out

  const draggableRef = useRef<HTMLDivElement>(null);
  const [imageContainerHeight, setImageContainerHeight] = useState('75vh'); 
  // Pass the Gen1 image to the ipfs-image-resizer-worker to retrive the image. Addresses 
  // issues with ipfs not consistently loading 
  const proxiedG1Url = poet.g1Url.replace("https://ipfs.io/ipfs/", "https://findlostpoets.xyz/ipfs/") + "?raw=true";


  const handlePoemModalBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (showPoemModal) {
      togglePoemModal();
    }
  };

  // Fade-in animation of PoetModal when it mounts
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 10); // small delay to trigger animation
  
    return () => clearTimeout(timeout);
  }, []);

  // Fade-out animation of PoetModal when returns
  const handleCloseModal = () => {
    setIsVisible(false); // Trigger fade-out
  
    setTimeout(() => {
      onReturn(); // Actually close after animation duration
    }, 400); // Match duration-400 or whatever you used in Tailwind
  };

  // checkOverflow useEffect to check for poem overflowing the poem section
  useEffect(() => {
    const element = poemContainerRef.current;
    if (element) {
      const currentIsOverflowing = element.scrollHeight > element.clientHeight;
      setIsPoemOverflowing(currentIsOverflowing); // Update state based on current overflow status
    }
  }, [poet.poem]); 

  // Set image container height useEffect
  useEffect(() => {
    const adjustLayoutHeights = () => {
      const navbarHeight = 56; // As specified, Navbar height is 56px
      const viewportHeight = window.innerHeight;
      const availableHeight = viewportHeight - navbarHeight; // Total available height minus the Navbar height
  
      setImageContainerHeight(`${availableHeight * 0.75}px`); // 75% for the image container
    };
  
    window.addEventListener('resize', adjustLayoutHeights);
    adjustLayoutHeights(); // Call on initial mount
  
    return () => {
      window.removeEventListener('resize', adjustLayoutHeights); // Clean up event listener
    };
  }, []);

  // Set the image container height based on the aspect ratio of the two images plus the padding 
  // inbetween. Subtracting this from the navbar height defines the height of the traits/poem container
  useEffect(() => {
    const adjustContainerDimensions = () => {
      const navbarHeight = 56; // Fixed navbar height
      const viewportHeight = window.innerHeight;
      const availableHeight = viewportHeight - navbarHeight;
      const targetHeight = availableHeight * 0.75; // 75% for the image container
  
      const padding = 30; // Adjust this value based on actual padding between images in pixels
      const targetWidth = 2 * targetHeight + padding; // Width for two images side by side plus padding
  
      setContainerDimensions({
        height: `${targetHeight}px`,
        width: `${targetWidth}px`
      });
    };
  
    window.addEventListener('resize', adjustContainerDimensions);
    adjustContainerDimensions();
  
    return () => {
      window.removeEventListener('resize', adjustContainerDimensions);
    };
  }, []);

  // useEffect to ensure that the browser's address bar is correctly encoded
  useEffect(() => {
    if (isStandalone) {
      const encodedName = encodeURIComponent(poet.pNam);
      const targetUrl = `/poet/${encodedName}`;
      if (window.location.pathname !== targetUrl) {
        window.history.replaceState(null, '', targetUrl);
      }
    }
  }, [isStandalone, poet.pNam]);
  
  const openImageModal = (imageSrc: string, imageSize: ImageSize) => {
    setCurrentModalImage(imageSrc);
    setImageModalOpen(true);
    setImageSize(imageSize);
  };

  return (
    <div 
      className={`flex flex-col h-screen overflow-y-auto bg-closetoblack text-pearlwhite transform transition-all duration-500 ${isStandalone ? 'bg-closetoblack' : ''} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} 
      onClick={handlePoemModalBackgroundClick}
    >
      <PoetDetailNavbar 
        poetClass={poet.class} 
        poetName={poet.pNam} 
        className="navbar" 
        onReturn={onReturn} 
        isStandalone={isStandalone}
        onClose={handleCloseModal} 
      />
      <div className="flex flex-1 relative bg-closetoblack items-center">
        {/* Main content container for images and traits */}
        <div className="grid grid-rows-[auto,1fr] min-h-0 w-full mx-auto my-4 overflow-y-auto">
          {/* Images container */}
          <div 
            className="flex justify-between items-center font-thin bg-closetoblack text-pearlwhite" 
            style={{ height: imageContainerHeight, width: containerDimensions.width, margin: '0 auto' }}
          >
            <div style={{ width: 'calc(50% - 15px)' }} onClick={() => openImageModal(poet.g0Url, '1X')}>  {/* Add right padding to the first image */}
              <img src={poet.g0Url} alt={`${poet.pNam} Gen0`} className="w-full h-full object-contain" loading="lazy" />
            </div>
            <div style={{ width: 'calc(50% - 15px)' }} onClick={() => openImageModal(poet.g1Url, '2X')}>  {/* Add left padding to the second image */}
              <img src={proxiedG1Url} alt={`${poet.pNam} Gen1`} className="w-full h-full object-contain" loading="lazy" />
            </div>
          </div>
          <ImageModal isOpen={isImageModalOpen} onClose={() => setImageModalOpen(false)} imageSrc={currentModalImage} imageSize={imageSize}/>
          {/* Container for the traits and the poem if it exists. */}
          {/* When the poem modal is not active, show this container. Hide this container when poem modal is active */}
          {!showPoemModal && (
          <div className="bg-closetoblack text-pearlwhite px-4 pb-4 pt-8 flex justify-center" style={{ width: containerDimensions.width, margin: '0 auto' }}>
            {hasPoem ? (
              <div className="flex gap-4 w-full h-auto">
                {/* First container for traits */}
                <div className="flex-1 px-4 pb-4">
                    <PoetModalTraits poet={poet} />
                </div>
                {/* Second container for the poem */}
                <div 
                  onClick={isPoemOverflowing ? togglePoemModal : undefined}
                  ref={poemContainerRef}
                  className={`flex-1 flex flex-col justify-start items-center text-center font-normal text-pearlwhite px-4 pb-4 overflow-y-auto max-h-28 ${
                    isPoemOverflowing ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  aria-label="Click to toggle poem details"
                >
                  <div className="whitespace-pre-wrap font-sans font-light text-lg">
                    {poet.poem}
                  </div>
                </div>
              </div>
            ) : (
              <PoetModalTraits poet={poet} />
            )}
          </div>
          )}
        </div>

        {/* Poem modal */}
        {hasPoem && showPoemModal && (
          <Draggable nodeRef={draggableRef}>
            <div 
              ref={draggableRef}
              className={`absolute left-[calc(50%+10px)] w-[calc(50%-40px)] h-[95%] border bg-verydarkgray border-darkgray text-pearlwhite rounded-3xl px-4 pb-4 z-50 transition-opacity duration-300 ease-in-out ${showPoemModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              style={{ cursor: 'move' }}
              onClick={(e) => e.stopPropagation()} // Prevents click from propagating to background
            >
              <div className="flex justify-end px-4 pt-4">
                <button onClick={togglePoemModal} className="text-lg">
                  <GrClose />
                </button>
              </div>
              <div className="flex flex-col h-[calc(100%-50px)]">
                <div className="flex-1 flex justify-center items-center text-center overflow-auto px-8">
                  <pre className="whitespace-pre-wrap max-h-full">
                    {poet.poem}
                  </pre>
                </div>
              </div>
            </div>
          </Draggable>
        )}
      </div>
    </div>
  );
}