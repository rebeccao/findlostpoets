import { PiArrowLeft } from "react-icons/pi";

interface PoetDetailNavbarProps {
  poetName: string;
  onBack: () => void;  // Add this prop for the back button callback
}

export default function PoetDetailNavbar({ poetName, onBack }: PoetDetailNavbarProps) {
  return (
    <header className="sticky top-0 z-[1] h-navbar mx-auto text-pearlwhite bg-darkgray border border-white p-2 flex w-full justify-between items-center"
       style={{ boxShadow: '0 4px 6px rgba(255, 255, 255, 0.1), 0 1px 3px rgba(255, 255, 255, 0.06)' }}>
      <div className="flex items-center ml-3">
				<button 
				  onClick={onBack} 
					className="relative flex items-center justify-center h-12 w-12"
					aria-label='Toggle Sidebar'
				>
					<PiArrowLeft size={30} className="cursor-pointer" />
				</button>
			</div>
      <div className="text-3xl font-[LeagueSpartan-SemiBold] mx-auto">
        {poetName}
      </div>
      <div style={{ width: '48px' }}></div> {/* Placeholder to maintain the center alignment of the title */}
    </header>
  );
}
