import React from 'react';
import { GrClose } from "react-icons/gr";

interface BaseModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  backgroundColor: string;
  textColor: string;
}

const BaseModal: React.FC<BaseModalProps> = ({ onClose, title, children, backgroundColor, textColor }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className={`relative px-5 pb-10 rounded-xl shadow-lg w-[70vw] max-w-5xl h-3/4 overflow-y-auto ${backgroundColor} ${textColor}`}>
        <div className="sticky top-0 bg-inherit flex justify-between items-center z-10 py-4">
          <h2 className="text-2xl font-normal">{title}</h2>
          <button onClick={onClose} aria-label="Close">
            <GrClose size={24} />
          </button>
        </div>
        <div className="space-y-4 font-extralight">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
