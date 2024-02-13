import { sidebarItems } from "~/components/sidebar/sidebar-data";
import type { SearchCriteria } from "~/routes/_index";
import React, { useState, useRef } from "react";
import { BiSearch, BiSolidChevronDown, BiSolidChevronUp } from "react-icons/bi";
import { GrFormClose } from "react-icons/gr";
import type { SidebarItemExpanded } from "~/components/sidebar/sidebar-data";

interface SidebarPanelProps {
  onSelectionChange: (dbQuery: SearchCriteria) => void;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ onSelectionChange }) => {
  console.log("SidebarPanel start");

  const [expandedRowId, setExpandedRowId] = useState<string | null>(null); // State to store the title of the currently expanded row, null if none
  const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(null); // state to store selected checkbox
  const inputRef = useRef<HTMLInputElement | null>(null);

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const expandCollapseRow = (sidebarItemTitle: string) => {
    if (expandedRowId === sidebarItemTitle) {
      setExpandedRowId(null); // If clicking the currently expanded row, collapse it
    } else {
      setExpandedRowId(sidebarItemTitle); // Otherwise, expand the clicked row
    }
  };

  const handleCheckboxChange = (title: string, dbField: string) => {
    if (title && selectedCheckbox !== title) {
      setSelectedCheckbox(title);

      // Complex DB query
      const dbQuery = {
        where: {
          [dbField]: { gt: 0 },
        },
        orderBy: {
          [dbField]: "asc", // Use dynamic field name
        },
      };

      console.log("SidebarPanel: handleCheckboxChange dbQuery: ", dbQuery);
      onSelectionChange(dbQuery);
    }
  };

  const handleSearchText = (dbField: string, value: string) => {
    // Complex DB query
    const dbQuery = {
      where: {
        [dbField]: { equals: value, mode: "insensitive" },
      },
    };

    console.log("SidebarPanel: handleSearchText dbQuery: ", dbQuery);
    onSelectionChange(dbQuery);
  };

  const handleRange = (
    sidebarItemExpanded: SidebarItemExpanded,
    gteValue: number,
    lteValue: number
  ) => {
    // { where: { WordCount: { gte: minNumber, lte: maxNumber } } }
    const searchCriteria = {
      where: {
        [sidebarItemExpanded.dbField]: { gte: gteValue, lte: lteValue }, // Use dynamic field name
      },
    };
    console.log("SidebarRow: Range onSelectionChange:", searchCriteria);
    //onSelectionChange(dbQuery, urlSegment); // Call the callback passed from the parent
  };

  return (
    <div> 
      {sidebarItems.map((sidebarItem, index) => {
        console.log("SidebarRow: received row item", sidebarItem);
        // Determine if the current sidebar item is expanded
        const rowExpanded = expandedRowId === sidebarItem.title;

        return (
          <React.Fragment key={sidebarItem.title}>
            <div
              onClick={() => expandCollapseRow(sidebarItem.title)} // Pass the sidebarItem's title to expand or collapse
              className="flex justify-between items-center px-1 py-1 list-none h-15 text-lg text-link-blue cursor-pointer hover:bg-sidebar-hover-bg hover:border-l-4 hover:border-sidebar-hover-border"
            >
              <div className="flex items-center">
                <span className="ml-4">{sidebarItem.title}</span>
              </div>
              <div>
                {sidebarItem.sidebarItemExpanded && rowExpanded ? (
                  <BiSolidChevronUp />
                ) : (
                  <BiSolidChevronDown />
                )}
              </div>
            </div>
            {rowExpanded &&
              sidebarItem.sidebarItemExpanded.map(
                (expandedSidebarItem, expandedSidebarItemIndex) => (
                  <div
                    key={`${sidebarItem.title}-${expandedSidebarItemIndex}`}
                    className="flex items-center p-2 pl-8 rounded hover:bg-gray-100 dark:hover:bg-gray-600 w-full"
                  >
                    {sidebarItem.type === "checkbox" ? (
                      <label className="w-full flex items-center cursor-pointer" htmlFor={index.toString()}>
                      <input
                        id={index.toString()}
                        type="checkbox"
                        value={expandedSidebarItem.dbField}
                        checked={selectedCheckbox === expandedSidebarItem.title}
                        onChange={() => handleCheckboxChange(expandedSidebarItem.title!, expandedSidebarItem.dbField)}
                        className="opacity-0 absolute h-4 w-4"
                      />
                      <span className={`ml-1 inline-block w-4 h-4 rounded-sm shadow-sm flex justify-center items-center mr-2 ${selectedCheckbox === expandedSidebarItem.title ? 'bg-gray-400 border-gray-700' : 'bg-white border border-gray-200'}`}>
                        {selectedCheckbox === expandedSidebarItem.title && (
                          <svg className="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      {expandedSidebarItem.title}
                    </label>
                    ) : sidebarItem.type === "search" ? (
                      <div className="relative rounded-md shadow-sm">
                        <div
                          className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
                          onClick={() =>
                            inputRef.current &&
                            handleSearchText(expandedSidebarItem.dbField, inputRef.current.value) 
                          }
                        >
                          <BiSearch />
                        </div>

                        <input
                          ref={inputRef}
                          type="text"
                          id={index.toString()}
                          placeholder="Search"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && inputRef.current) {
                              handleSearchText(expandedSidebarItem.dbField, e.currentTarget.value
                              );
                              e.currentTarget.blur(); // remove focus from the input
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
                    ) : (
                      <div className="flex flex-col items-start">
                        <label
                          htmlFor={expandedSidebarItemIndex.toString()}
                          className="mb-1"
                        >
                          {expandedSidebarItem.title}
                        </label>
                        <input
                          id={expandedSidebarItemIndex.toString()}
                          type="range"
                          //min={subItem.min}
                          //max={subItem.max}
                          //step={subItem.step}
                          className="..."
                        />
                        <span className="text-sm mt-1">
                          Value: {/* Dynamic value display logic */}
                        </span>
                      </div>
                    )}
                  </div>
                )
              )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SidebarPanel;
