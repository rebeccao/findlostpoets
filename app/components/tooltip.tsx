//tooltip.tsx

import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { IoIosInformationCircleOutline } from "react-icons/io";

// Define a type for the props
interface TooltipProps {
  children: ReactNode; // ReactNode covers anything that can be rendered: numbers, strings, elements or an array of these types.
  content: string; // Assuming content will always be a string
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative flex items-center">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        tabIndex={0} // Make it focusable
        className="ml-4 flex items-center cursor-pointer"
      >
        <div className="mr-2">{children}</div>
        <span className="ml-1 text-gray-500 hover:text-gray-700">
          <IoIosInformationCircleOutline className="h-4 w-4" /> 
        </span>
      </div>
      {show && (
        <div className="absolute z-10 w-48 p-2 mt-2 text-sm text-white bg-black rounded-md shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
