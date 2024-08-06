import { useEffect, useRef } from "react";
import { GrClose } from "react-icons/gr";

interface PoemModalProps {
  poem: string;
  onReturn: () => void;
}

// Poem modal for mobile devices.
export default function PoemModalMobile({ poem, onReturn }: PoemModalProps) {

  const containerRef = useRef<HTMLDivElement>(null);

  // Added this to force poem to display starting at the top
  // for mobile devices. It is not working yet...
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <div className={`flex flex-1 min-h-screen relative bg-verydarkgray text-pearlwhite p-4 z-50`}>
      <div className="fixed top-4 right-4">
        <button onClick={onReturn} className="text-lg">
          <GrClose />
        </button>
      </div>
      <div 
        ref={containerRef}
        className="flex-1 flex flex-col justify-start items-center text-center overflow-auto p-4"
      >
        <pre className="whitespace-pre-wrap max-h-full w-full font-light text-2xl">
          {poem}
        </pre>
      </div>
    </div>
  );
}