import { GrClose } from "react-icons/gr";

interface PoemModalProps {
  poem: string;
  onReturn: () => void;
}

export default function PoemModal({ poem, onReturn }: PoemModalProps) {

  return (
    <div className={`flex flex-1 min-h-screen relative bg-verydarkgray text-pearlwhite p-4 z-50`}>
      <div className="fixed top-4 right-4">
        <button onClick={onReturn} className="text-lg">
          <GrClose />
        </button>
      </div>
      <div className="flex-1 flex justify-center items-center text-center overflow-auto p-4">
        <pre className="whitespace-pre-wrap max-h-full">
          {poem}
        </pre>
      </div>
    </div>
  );
}