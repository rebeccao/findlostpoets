import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import type { Poet } from '@prisma/client';
import PoetDetailNavbar from '~/components/navbar-poet-detail';
import PoetDetailTraits from '~/components/detail/poetdetail-traits';
import ImageModal from './imagemodal'; 
import { GrClose } from "react-icons/gr";

interface PoetDetailProps {
  poet: Poet;
  hasPoem: boolean;
  onReturn: () => void;
}

export type ImageSize = '1X' | '2X';

// Display Poet's details. The poem m
export default function PoetDetail({ poet, hasPoem, onReturn }: PoetDetailProps) {
  const [showPoemModal, setShowPoemModal] = useState(false);
  const [isPoemOverflowing, setIsPoemOverflowing] = useState(false);
  const poemContainerRef = useRef<HTMLDivElement>(null);
  const togglePoemModal = () => setShowPoemModal(!showPoemModal);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState<string>('');
  const [imageSize, setImageSize] = useState<ImageSize>('1X');
  const [containerDimensions, setContainerDimensions] = useState({ height: '75vh', width: '50%' });

  const [imageContainerHeight, setImageContainerHeight] = useState(() => {
    const navbarHeight = 56; // Assuming navbar height is known and fixed
    const initialViewportHeight = window.innerHeight;
    const availableHeight = initialViewportHeight - navbarHeight;
    return `${availableHeight * 0.75}px`;
  });

  const handlePoemModalBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (showPoemModal) {
      togglePoemModal();
    }
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
  
      const newImageContainerHeight = `${availableHeight * 0.75}px`; // 75% for the image container
      //const newTraitsContainerHeight = `${availableHeight * 0.25}px`; // 25% for the traits container
  
      setImageContainerHeight(newImageContainerHeight);
      //setTraitsContainerHeight(newTraitsContainerHeight); // Assuming you have a state to manage this
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
  
  const openImageModal = (imageSrc: string, imageSize: ImageSize) => {
    setCurrentModalImage(imageSrc);
    setImageModalOpen(true);
    setImageSize(imageSize);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto" onClick={handlePoemModalBackgroundClick}>
      <PoetDetailNavbar poetName={poet.pNam} className="navbar" onReturn={onReturn} />
      <div className="flex flex-1 relative bg-closetoblack items-center">
        {/* Main content container for images and traits */}
        <div className="grid grid-rows-[auto,1fr] min-h-0 w-full mx-auto my-4 overflow-y-auto">
          {/* Images container */}
          <div className="flex justify-between items-center  bg-closetoblack" style={{ height: containerDimensions.height, width: containerDimensions.width, margin: '0 auto' }}>
            <div style={{ width: 'calc(50% - 15px)' }} onClick={() => openImageModal(poet.g0Url, '1X')}>  {/* Add right padding to the first image */}
              <img src={poet.g0Url} alt={`${poet.pNam} Gen0`} className="w-full h-full object-contain" loading="lazy" />
            </div>
            <div style={{ width: 'calc(50% - 15px)' }} onClick={() => openImageModal(poet.g1Url, '2X')}>  {/* Add left padding to the second image */}
              <img src={poet.g1Url} alt={`${poet.pNam} Gen1`} className="w-full h-full object-contain" loading="lazy" />
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
                    <PoetDetailTraits poet={poet} />
                </div>
                {/* Second container for the poem */}
                <div 
                  onClick={isPoemOverflowing ? togglePoemModal : undefined}
                  ref={poemContainerRef}
                  className={`flex-1 flex flex-col justify-start items-center text-center text-pearlwhite px-4 pb-4 overflow-y-auto max-h-28 ${
                    isPoemOverflowing ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  aria-label="Click to toggle poem details"
                >
                  <pre className="whitespace-pre-wrap">{poet.poem}</pre>
                </div>
              </div>
            ) : (
              <PoetDetailTraits poet={poet} />
            )}
          </div>
          )}
        </div>

        {/* Poem modal */}
        {hasPoem && showPoemModal && (
          <Draggable>
            <div 
              className={`fixed top-14 left-1/2 transform -translate-x-1/2 w-1/2 max-h-[calc(100vh-66px)] bg-verydarkgray text-pearlwhite rounded-3xl px-4 pb-4 z-50 transition-opacity duration-300 ease-in-out ${showPoemModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              style={{ cursor: 'move' }}
              onClick={(e) => e.stopPropagation()} // Prevents click from propagating to background
            >
              <button onClick={togglePoemModal} className="text-lg pt-5 pr-2 pb-2">
                <GrClose />
              </button>
              <div className="text-center overflow-auto max-h-[calc(100vh-110px)] px-2 sm:px-8 lg:px-32">
                <pre className="whitespace-pre-wrap pb-10" >
                  {poet.poem}
                </pre>
              </div>
            </div>
          </Draggable>
        )}
      </div>
    </div>
  );
}