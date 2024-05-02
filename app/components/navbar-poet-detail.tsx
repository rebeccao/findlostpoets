import { PiArrowLeft } from "react-icons/pi";

interface PoetDetailNavbarProps {
  poetName: string;
  onBack: () => void;  // Add this prop for the back button callback
}

export default function PoetDetailNavbar({ poetName, onBack }: PoetDetailNavbarProps) {
  return (
    <header className="sticky top-0 z-[1] h-navbar mx-auto bg-gray-100 border-gray-300 p-2 shadow-md flex w-full justify-between items-center dark:border-gray-800 dark:bg-d-background dark:text-d-text-primary">
      <div className="flex items-center ml-3">
				<button 
				  onClick={onBack} 
					className="relative flex items-center justify-center h-12 w-12"
					aria-label='Toggle Sidebar'
				>
					<PiArrowLeft size={30} className="cursor-pointer text-darkgray" />
				</button>
			</div>
      <div className="text-3xl font-[LeagueSpartan-SemiBold] text-darkgray mx-auto">
        {poetName}
      </div>
      <div style={{ width: '48px' }}></div> {/* Placeholder to maintain the center alignment of the title */}
    </header>
  );
}
