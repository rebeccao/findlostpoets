import React from 'react';
import { GrClose } from "react-icons/gr";

interface BaseModalProps {
  onClose: () => void;
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  noScroll?: boolean; 
  customWidth?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({ onClose, isOpen, title, children, noScroll, customWidth }) => {
  return (
    <div className={`relative px-5 pb-10 rounded-xl shadow-lg ${customWidth || 'w-[70vw]'} 'max-w-5xl' h-3/4 ${noScroll ? '' : 'overflow-y-auto'} border bg-closetoblack border-deepgray text-lightmedgray transition-transform duration-500 ease-out transform ${
      isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
      <div className="sticky top-0 bg-inherit flex justify-between items-center z-10 py-4">
        <h2 className="text-2xl font-light">{title}</h2>
        <button onClick={onClose} aria-label="Close">
          <GrClose size={24} />
        </button>
      </div>
      <div className="space-y-4 font-extralight">
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
