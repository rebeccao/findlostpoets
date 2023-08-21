import React, { useRef } from 'react';
import { BiSearch } from "react-icons/bi";
import { GrFormClose } from "react-icons/gr";

const SidebarRowSearch = ({ handleTermSelect, searchTerm, index }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="relative rounded-md shadow-sm">
      <div
        className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
        onClick={(e) => {
          if (inputRef.current) {
            handleTermSelect({ [searchTerm]: inputRef.current.value });
          }
        }}
      >
        <BiSearch />
      </div>

      <input
        ref={inputRef}
        type="text"
        id={index.toString()}
        placeholder="Search"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleTermSelect({ [searchTerm]: e.currentTarget.value });
            e.currentTarget.blur();  // remove focus from the input
          }
        }}
        className="form-input block w-full sm:text-sm pl-10 pr-8 sm:leading-9 rounded-md focus:outline-none"
      />

      <div 
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        onClick={clearInput}
      >
        <GrFormClose />
      </div>
    </div>
  );
};

export default SidebarRowSearch;