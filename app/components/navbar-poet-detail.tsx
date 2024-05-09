import { PiArrowLeft } from "react-icons/pi";

interface PoetDetailNavbarProps {
  poetName: string;
  className?: string;  // Optional string for CSS classes
  onReturn: () => void;  // Add this prop for the back button callback
}

export default function PoetDetailNavbar({ poetName, className, onReturn }: PoetDetailNavbarProps) {
  return (
    <header className={`navbar sticky top-0 h-navbar mx-auto text-pearlwhite bg-closetoblack border border-darkgray  p-2 shadow-xl flex w-full justify-between items-center ${className}`}>
      <div className="flex items-center ml-3">
				<button 
				  onClick={onReturn} 
					className="relative flex items-center justify-center h-12 w-12"
					aria-label='Toggle Sidebar'
				>
					<PiArrowLeft size={30} className="cursor-pointer" />
				</button>
			</div>
      <div className="text-3xl font-[LeagueSpartan-Regular] mt-1 mx-auto">
        {poetName}
      </div>
      <div style={{ width: '48px' }}></div> {/* Placeholder to maintain the center alignment of the title */}
    </header>
  );
}
