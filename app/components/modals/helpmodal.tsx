import React from 'react';
import { GoX } from "react-icons/go";

interface HelpModalProps {
  onClose: () => void;
  backgroundColor: string;
  textColor: string;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose, backgroundColor, textColor }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`p-6 rounded-2xl shadow-lg w-11/12 max-w-2xl h-3/4 overflow-y-auto ${backgroundColor} ${textColor}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Help</h2>
          <button onClick={onClose} aria-label="Close">
            <GoX size={24} />
          </button>
        </div>
        <p>Details about help...</p>
        {/* Add more text here as needed */}
      </div>
    </div>
  );
};

export default HelpModal;
