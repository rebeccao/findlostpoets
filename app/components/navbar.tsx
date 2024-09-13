// navbar.tsx
import React, { useState, useRef } from 'react';
import { NavbarProps } from '~/routes/_index';
import { PiListMagnifyingGlassLight, PiListLight, PiCaretDownBold } from "react-icons/pi"; 
import { PiCaretLeft } from "react-icons/pi";
import ReleaseNotesModal from '~/components/modals/releasenotesmodal';
import HelpModal from '~/components/modals/helpmodal';
import AboutModal from '~/components/modals/aboutmodal';
import TopCollectorsModal from '~/components/modals/topcollectorsmodal';

const Navbar: React.FC<NavbarProps> = React.memo(({ toggleSidebar, className, count, searchCriteriaArray, onTopCollectorSelect }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTopCollectorsOpen, setIsTopCollectorsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
	const [isReleaseNotesOpen, setIsReleaseNotesOpen] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleTopCollectorSelect = (topCollector: { key: string; value: string }) => {
    setTimeout(() => {
      // Close the modal after a delay
      setIsTopCollectorsOpen(false); 
      setIsDropdownOpen(false);
    }, 400);
    onTopCollectorSelect(topCollector); // Pass the topCollector to Index
  };

	const openHelp = () => {
    setIsHelpOpen(true);
  };

  const openAbout = () => {
    setIsAboutOpen(true);
  };

	const openReleaseNotes = () => {
    setIsReleaseNotesOpen(true);
  };

  return (
    <header ref={navbarRef} className={`navbar sticky top-0 h-navbar mx-auto border text-pearlwhite bg-verydarkgray border-deepgray p-2 shadow-xl flex w-full items-center ${className}`}>
      {/* Small and Medium Screen Layout */}
      {/*<div className="md:hidden flex items-center w-full relative">*/}
      <div className="md:hidden grid grid-cols-[.25fr_2.6fr_.4fr] items-center w-full px-2 py-2"> 
        <div className="flex justify-start items-center">
          <button 
            onClick={toggleSidebar} 
            className="relative flex items-center justify-start h-12 w-12 hover-grow"
            aria-label='Toggle Sidebar'
          >
            <PiListMagnifyingGlassLight size={38} className="cursor-pointer" />
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-lg font-[LeagueSpartan-Regular]"> 
            F I N D L O S T P O E T S
          </div> 
          <div className="text-xs font-[LeagueSpartan-Light] -mt-1">
            (UNOFFICIAL)
          </div> 
        </div>
				<div className="flex justify-end items-center">
        {count !== undefined && (
          <div className="flex flex-col items-center">
						<div className="text-xs font-[LeagueSpartan-Light]">
							FOUND:
						</div>
						<div className="text-sm font-[LeagueSpartan-Regular]">
							{count}
						</div>
					</div>
        )}
      	</div>
      </div>

      {/* Larger Screen Layout */}
      <div className="hidden md:grid grid-cols-[.25fr_1.25fr_1.25fr_1.25fr_.25fr] xl:grid-cols-[.25fr_2fr_1.2fr_2fr_.25fr] items-center w-full px-4 py-2">
        {/* Left Container */}
        <div className="flex justify-start items-center">
          <button 
            onClick={toggleSidebar} 
            className="relative flex items-center justify-center h-14 w-14 hover-grow"
            aria-label='Toggle Sidebar'
          >
            <PiListMagnifyingGlassLight size={40} className="cursor-pointer" />
          </button>
        </div>
        {/* Left Middle Container */}
        <div className="flex flex-row items-center ml-2 space-x-6">
          <button 
            onClick={() => setIsTopCollectorsOpen(true)} 
            className="flex flex-col items-center focus:outline-none"
            aria-label="Open Top Collectors"
          >
            <div className="text-xs mt-2 font-[LeagueSpartan-Light]">
              TOP 200+
            </div>
            <div className="text-xs -mt-1 font-[LeagueSpartan-Light]">
              COLLECTORS
            </div>
            <PiCaretDownBold size={10} className=" cursor-pointer text-pearlwhite" />
          </button>
          {count !== undefined && (
            <div className="flex flex-col items-center">
              <div className="text-xs mt-2 font-[LeagueSpartan-Light]">
                POETS FOUND:
              </div>
              <div className="text-md -mt-1 font-[LeagueSpartan-Regular]">
                {count}
              </div>
            </div>
          )}
        </div>

        {/* Center Container */}
        <div className="flex flex-col items-center">
          <div className="text-xl lg:text-2xl font-[LeagueSpartan-Regular]"> 
            F I N D L O S T P O E T S
          </div> 
          <div className="text-xs font-[LeagueSpartan-Light] -mt-1">
            (UNOFFICIAL)
          </div> 
        </div>
        {/* Right Middle Container */}
        <div className="flex flex-col items-end">
          {searchCriteriaArray !== undefined && searchCriteriaArray.length > 0 && (
            <div className="flex flex-col items-start">
              <div className="text-xs mt-2 font-[LeagueSpartan-Light]">
                SEARCH:
              </div>
              <div className="text-md font-[LeagueSpartan-Light] overflow-hidden text-ellipsis whitespace-nowrap max-w-full md:max-w-[200px] lg:max-w-[280px] xl:max-w-full">
                <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {searchCriteriaArray.join(' + ')}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Right Container */}
        <div className="flex items-center justify-end">
          {/* The Information icon has a dropdown that lists various information items. The */}
          {/* dropdown is added on top of a viewport sized transparent over-lay that allows */}
          {/* clicking anywhere on the view to dismiss the dropdown without activating PoetModals. */}
          <div className="relative flex items-center justify-center">
            <button 
              onClick={toggleDropdown} 
              className="relative flex items-center justify-center h-14 w-14"
              aria-label='Menu'
            >
              <PiListLight size={40} className="cursor-pointer" />
            </button>
            <div
              className={`fixed inset-0 z-40 bg-transparent pointer-events-auto transition-opacity duration-300 ${
                isDropdownOpen ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={closeDropdown}
              style={{ pointerEvents: isDropdownOpen ? 'auto' : 'none' }}
            ></div>
            <div
              className={`absolute z-50 right-0 top-full w-52 shadow-xl border bg-closetoblack border-charcoalgray text-lightmedgray rounded-xl pointer-events-auto transition-all duration-400 ease-out transform ${
                isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              <div className="p-3 cursor-pointer" onClick={openHelp}>
                <div className="flex items-center">
                  <PiCaretLeft />
                  <h2 className="font-light ml-2">Help</h2>
                </div>
              </div>
              <div className="border-t border-deepgray"></div>
              <div className="p-3 cursor-pointer" onClick={openAbout}>
                <div className="flex items-center">
                  <PiCaretLeft />
                  <h2 className="font-light ml-2">About</h2>
                </div>
              </div>
              <div className="border-t border-deepgray"></div>
              <div className="p-3 cursor-pointer" onClick={openReleaseNotes}>
                <div className="flex items-center">
                  <PiCaretLeft />
                  <h2 className="font-light ml-2">Release Notes</h2>
                </div>
              </div>
              <div className="border-t border-deepgray"></div>
              <div className="p-2 flex text-xs items-center justify-start ml-7">
                <span className="font-light">Version: 1.3.0</span>
              </div>
            </div>
            <div
              className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-700 ${
                isTopCollectorsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <TopCollectorsModal 
                onClose={() => setIsTopCollectorsOpen(false)} 
                isOpen={isTopCollectorsOpen} 
                onTopCollectorSelect={handleTopCollectorSelect} // Pass the callback to TopCollectorsModal
              />
            </div>
            <div
              className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-500 ${
                isHelpOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <HelpModal onClose={() => setIsHelpOpen(false)} isOpen={isHelpOpen} />
            </div>
            <div
              className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-500 ${
                isAboutOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <AboutModal onClose={() => setIsAboutOpen(false)} isOpen={isAboutOpen} />
            </div>
            <div
              className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-500 ${
                isReleaseNotesOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <ReleaseNotesModal onClose={() => setIsReleaseNotesOpen(false)} isOpen={isReleaseNotesOpen} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Navbar;