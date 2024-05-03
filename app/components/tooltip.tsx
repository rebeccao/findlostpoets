import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { IoIosInformationCircleOutline } from "react-icons/io";

interface TooltipProps {
  children: ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0} // Ensure the whole area is focusable
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      <div className="flex items-center cursor-pointer">
        <div className="mr-2">{children}</div>
        <span className="ml-1 text-mediumgray">
          <IoIosInformationCircleOutline className="h-4 w-4" />
        </span>
      </div>
      {show && (
        <div className="absolute z-10 w-48 p-2 mt-2 text-sm text-white bg-charcoalgray rounded-md shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
