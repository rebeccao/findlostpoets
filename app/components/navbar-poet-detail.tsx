import { PiArrowLeft } from "react-icons/pi";

interface PoetDetailNavbarProps {
  poetClass: string;        // Todo: finish this thought
  poetName: string;
  className?: string;       // Optional string for CSS classes
  onReturn: () => void;     // Add this prop for the back button callback
  isStandalone?: boolean;   // Is poet details called by _index in a modal or stand alone called by the user
  onClose: () => void;      // used to animate a fade-out of the PoetModal
}

export default function PoetDetailNavbar({ poetClass, poetName, className, onReturn, isStandalone, onClose }: PoetDetailNavbarProps) {
  return (
    <header className={`navbar sticky top-0 h-navbar mx-auto border text-pearlwhite bg-verydarkgray border-deepgray p-2 shadow-xl flex w-full justify-between items-center ${className}`}>
      <div className="flex items-center ml-3">
        {!isStandalone && (
          <button 
            onClick={onClose || onReturn} 
            className="relative flex items-center justify-center h-12 w-12 hover-grow"
            aria-label='Return'
          >
            <PiArrowLeft size={28} className="cursor-pointer" />
          </button>
        )}
      </div>
      <div className="text-3xl font-[LeagueSpartan-Light] mt-1 mx-auto">
        {poetName}
      </div>
      {/*<div style={{ width: '48px' }}></div> {/* Placeholder to maintain the center alignment of the title */}
      <div className="text-2xl font-[LeagueSpartan-Light] mr-5">
        {poetClass}
      </div>
    </header>
  );
}
