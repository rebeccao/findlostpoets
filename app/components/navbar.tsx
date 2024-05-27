import React from 'react';
import { NavbarProps } from '~/routes/_index';
import { PiListMagnifyingGlassLight } from "react-icons/pi";  

const Navbar: React.FC<NavbarProps> = React.memo(({ toggleSidebar, className, count }) => {
  return (
    <header className={`navbar sticky top-0 h-navbar mx-auto border text-pearlwhite bg-verydarkgray border-deepgray p-2 shadow-xl flex w-full justify-between items-center ${className}`}>
      {/* Small Screen Layout */}
      <div className="flex xl:hidden items-center justify-between w-full relative">
        <div className="flex items-start">
          <button 
            onClick={toggleSidebar} 
            className="relative flex items-center justify-start h-12 w-12 hover-grow"
            aria-label='Toggle Sidebar'
          >
            <PiListMagnifyingGlassLight size={38} className="cursor-pointer" />
          </button>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="text-lg font-[LeagueSpartan-Regular]"> 
            F I N D L O S T P O E T S
          </div> 
          <div className="text-xs font-[LeagueSpartan-Light] -mt-1">
            (UNOFFICIAL)
          </div> 
        </div>
				<div className="flex items-center justify-center">
        {count !== undefined && (
          <div className="flex flex-col items-center ml-2">
						<div className="text-xs font-[LeagueSpartan-Light]">
							POETS FOUND:
						</div>
						<div className="text-sm font-[LeagueSpartan-Regular]">
							{count}
						</div>
					</div>
        )}
      	</div>
      </div>

      {/* Medium and Larger Screen Layout */}
      <div className="hidden xl:flex items-center justify-between w-full relative">
        <div className="flex items-center ml-3">
          <button 
            onClick={toggleSidebar} 
            className="relative flex items-center justify-center h-14 w-14 hover-grow"
            aria-label='Toggle Sidebar'
          >
            <PiListMagnifyingGlassLight size={40} className="cursor-pointer" />
          </button>
					{count !== undefined && (
          <div className="flex flex-col items-center ml-5">
						<div className="text-sm mt-2 font-[LeagueSpartan-Light]">
							POETS FOUND:
						</div>
						<div className="text-lg -mt-1 font-[LeagueSpartan-Regular]">
							{count}
						</div>
					</div>
        )}
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="text-xl lg:text-2xl font-[LeagueSpartan-Regular]"> 
            F I N D L O S T P O E T S
          </div> 
          <div className="text-xs font-[LeagueSpartan-Light] -mt-1">
            (UNOFFICIAL)
          </div> 
        </div>
        <div className="flex items-center justify-center invisible">
          {/* Placeholder to keep the structure */}
        </div>
      </div>
    </header>
  );
});

export default Navbar;