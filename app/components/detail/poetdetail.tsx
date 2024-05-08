import React, { useState } from 'react';
import Draggable from 'react-draggable';
import type { Poet } from '@prisma/client';
import PoetDetailNavbar from '~/components/navbar-poet-detail';
import PoetTraits from '~/components/detail/poettraits';
import { GrClose } from "react-icons/gr";

interface PoetDetailProps {
  poet: Poet;
  hasPoem: boolean;
  onBack: () => void;
}

// Display Poet's details. The poem m
export default function PoetDetail({ poet, hasPoem, onBack }: PoetDetailProps) {
  const [showPoemModal, setShowPoemModal] = useState(false);
  const toggleModal = () => setShowPoemModal(!showPoemModal);

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (showPoemModal) {
      toggleModal();
    }
  };
  
  return (
    <div className="flex flex-col h-screen" onClick={handleBackgroundClick}>
      <PoetDetailNavbar poetName={poet.pNam} className="navbar" onBack={onBack} />
      <div className="flex flex-1 overflow-hidden relative bg-closetoblack">
        {/* Main content section for images and traits */}
        <div className="grid grid-rows-[auto,1fr] min-h-0 w-full max-w-7xl mx-auto my-6 overflow-y-auto">
          {/* Images container */}
          <div className="flex justify-center items-center px-4 bg-closetoblack">
            <div style={{ width: '50%', padding: '0 10px 0 0' }}>  {/* Add right padding to the first image */}
              <img src={poet.g0Url} alt={`${poet.pNam} Gen0`} className="w-full" />
            </div>
            <div style={{ width: '50%', padding: '0 0 0 10px' }}>  {/* Add left padding to the second image */}
              <img src={poet.g1Url} alt={`${poet.pNam} Gen1`} className="w-full" />
            </div>
          </div>
          {/* Container for the traits and the poem if it exists. */}
          {/* When the poem modal is not active, show this container. Hide this container when poem modal is active */}
          {!showPoemModal && (
          <div className="bg-closetoblack text-pearlwhite px-4 pb-4 pt-8 flex justify-center">
            {hasPoem ? (
              <div className="flex gap-4 w-full">
                {/* First section for traits */}
                <div className="flex-1 px-4 pb-4">
                    <PoetTraits poet={poet} />
                </div>
                {/* Second section for the poem */}
                <div onClick={toggleModal}
                  className="flex-1 flex-col justify-center items-start text-center text-pearlwhite px-4 pb-4 overflow-y-auto max-h-64 cursor-pointer"
                >
                  <pre className="whitespace-pre-wrap">{poet.poem}</pre>
                </div>
              </div>
            ) : (
              <PoetTraits poet={poet} />
            )}
          </div>
          )}
        </div>

        {/* Poem modal */}
        {hasPoem && showPoemModal && (
          <Draggable>
            <div 
              className="fixed top-16 left-1/2 w-2/5 h-full bg-verydarkgray text-pearlwhite rounded-3xl px-4 pb-4 z-50"
              style={{ cursor: 'move' }}
              onClick={(e) => e.stopPropagation()} // Prevents click from propagating to background
            >
              <button onClick={toggleModal} className="text-lg pt-5 pl-2 pb-2">
                <GrClose />
              </button>
              <div className="text-center overflow-auto h-full">
                <pre className="whitespace-pre-wrap">{poet.poem}</pre>
              </div>
            </div>
          </Draggable>
        )}
      </div>
    </div>
  );
}