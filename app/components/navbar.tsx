import React from 'react';
import { NavbarProps } from '~/routes/_index';
import { PiList } from "react-icons/pi";  

const Navbar: React.FC<NavbarProps> = React.memo(({ toggleSidebar, className, count }) => {
	return(
		<header className={`navbar sticky top-0 h-navbar mx-auto border text-pearlwhite bg-verydarkgray border-deepgray p-2 shadow-xl flex w-full justify-between items-center ${className}`}>
			<div className="flex items-center ml-3">
				<button 
				  onClick={toggleSidebar} 
					className="relative flex items-center justify-center h-12 w-12 hover-grow"
					aria-label='Toggle Sidebar'
				>
					<PiList size={38} className="cursor-pointer" />
				</button>
			</div>
			{/* Centered Banner */}
			<div className="flex flex-col items-center mx-auto"> 
				<div className="text- lg:text-2xl md:text-xl sm:text-base font-[LeagueSpartan-SemiBold]"> 
					F I N D L O S T P O E T S
				</div> 
				<div className="text-xs font-[LeagueSpartan-Regular] -mt-1">
					(UNOFFICIAL)
				</div> 
      </div>
      <div className="flex items-center justify-center">
        {count !== undefined && (
          <div className="text-sm font-[LeagueSpartan-Regular] mr-3">
            {`Poets Found: ${count}`}
          </div>
        )}
      </div>
		</header>
	);
});

export default Navbar;