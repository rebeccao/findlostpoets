import React, { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { IoIosInformationCircleOutline } from "react-icons/io";

interface TooltipProps {
  children: ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      setShow(true);
    }, 500); // Adjust the delay time as needed
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShow(false);
  };

  const handleFocus = () => {
    timeoutRef.current = window.setTimeout(() => {
      setShow(true);
    }, 350); // Adjust the delay time as needed
  };

  const handleBlur = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShow(false);
  };

  return (
    <div
      className="relative flex items-center cursor-help"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0} // Ensure the whole area is focusable
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className="mr-2">{children}</div>
      <div className="relative flex items-center">
        <span className="ml-1 text-mediumgray">
          <IoIosInformationCircleOutline className="h-4 w-4" />
        </span>
        {show && (
          <div className="absolute z-10 w-60 p-2 mt-2 text-sm text-pearlwhite bg-charcoalgray rounded-md shadow-lg" style={{ top: '100%', left: '-40%', transform: 'translateX(-40%)'}}>
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tooltip;
