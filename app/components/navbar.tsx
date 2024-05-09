import { NavbarProps } from '~/routes/_index';
import { PiList } from "react-icons/pi";  

export default function Navbar({ toggleSidebar, className }: NavbarProps) {
	return(
		<header className={`navbar sticky top-0 h-navbar mx-auto text-pearlwhite bg-closetoblack border border-closetoblack p-2 shadow-xl flex w-full justify-between items-center ${className}`}
      style={{ boxShadow: '0 4px 6px rgba(255, 255, 255, 0.1), 0 1px 3px rgba(255, 255, 255, 0.06)' }}>
			<div className="flex items-center ml-3">
				<button 
				  onClick={toggleSidebar} 
					className="relative flex items-center justify-center h-12 w-12"
					aria-label='Toggle Sidebar'
				>
					<PiList size={38} className="cursor-pointer" />
				</button>
			</div>
			{/* Centered Banner */}
			<div className="flex flex-col items-center mx-auto"> 
				<div className="text-base lg:text-2xl md:text-xl sm:text-base font-[LeagueSpartan-SemiBold]"> 
					F I N D L O S T P O E T S
				</div> 
				<div className="text-xs font-[LeagueSpartan-Regular] -mt-1">
					(UNOFFICIAL)
				</div> 
      </div>
      <div style={{ width: '48px' }}> {/* Placeholder to balance the space */}
      </div>
		</header>
	);
}