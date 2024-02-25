import { sidebarItems } from "~/components/sidebar/sidebar-data";
import React, { useState } from "react";
//import { BiSearch, BiSolidChevronDown, BiSolidChevronUp } from "react-icons/bi";
import { GrFormClose } from "react-icons/gr";
import type { SidebarProps } from "~/routes/_index";
import CustomCheckbox from "~/components/custom-checkbox";
import Tooltip from "~/components/tooltip";

const SidebarPanel: React.FC<SidebarProps> = ({ 
  selectedRareTraitCheckboxes, 
  searchTrait,
  selectedRanges, 
  onRareTraitCheckboxChange, 
  onSearchTraitChange, 
  onRangeChange,
  onSelectionChange 
}) => {
  console.log("SidebarPanel start");

  // Initialize initialTraitDbField with what is displayed in the select dropdown, i.e., the first item
  //const initialTraitDbField = sidebarItems[0].expandedSidebarItems[0].dbField;
  //const [searchCriteria, setSearchCriteria] = useState({ searchTrait: initialTraitDbField, searchTraitValue: '' });

  // Handler for changing the searchTrait
  const handleSearchTraitChange = (newSearchTraitKey: string) => {
    // Preserve the current searchTraitValue while updating searchTraitKey
    const updatedSearchTrait = {
      searchTraitKey: newSearchTraitKey,
      searchTraitValue: searchTrait.searchTraitValue,
    };
    onSearchTraitChange(updatedSearchTrait);
  };

  // Handler for changing the searchTrait Value
  const handleSearchTraitValueChange = (newSearchTraitValue: string) => {
    // Update searchTraitValue while keeping the current searchTraitKey
    const updatedSearchTrait = {
      searchTraitKey: searchTrait.searchTraitKey,
      searchTraitValue: newSearchTraitValue,
    };
    onSearchTraitChange(updatedSearchTrait);
  };

  const clearInput = () => {
    // Set searchTraitValue  to empty string while keeping the current searchTraitKey
    const updatedSearchTrait = {
      searchTraitKey: searchTrait.searchTraitKey,
      searchTraitValue: '',
    };
    onSearchTraitChange(updatedSearchTrait);
  };

  // Handler for the search button click
  const handleSearchClick = () => {
    // Perform the search only if the term is not empty
    if (searchTrait.searchTraitValue.trim() !== '') {
      const dbQuery = {
        where: {
          [searchTrait.searchTraitKey]: { equals: searchTrait.searchTraitValue.trim(), mode: "insensitive" } 
        },
      };
  
      console.log("SidebarPanel: handleSearchText dbQuery: ", dbQuery);
      onSelectionChange(dbQuery);
    }
  };

  const [localRangeValues, setLocalRangeValues] = useState<Record<string, { min: string; max: string }>>({});

  const handleRangeInputChange = (dbField: string, rangeType: 'min' | 'max', value: string) => {
    setLocalRangeValues(prev => ({
        ...prev,
        [dbField]: { ...prev[dbField], [rangeType]: value },
    }));
    console.log("handleRangeInputChange: localRangeValues = ", localRangeValues)
  };

  const handleCheckboxChange = (dbField: string, isChecked: boolean) => {
    const updatedSelections = { ...selectedRareTraitCheckboxes, [dbField]: isChecked };

    // Update the selected checkboxes state
    onRareTraitCheckboxChange(updatedSelections);
  };

  const handleRareTraitCheckboxChange = (dbField: string, isChecked: boolean) => {
    const updatedSelections = { ...selectedRareTraitCheckboxes, [dbField]: isChecked };

    // Update the selected checkboxes state
    onRareTraitCheckboxChange(updatedSelections);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="h-screen pb-14 overflow-y-auto scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="py-4 pt-navbar">
          {sidebarItems.map((sidebarItem, index) => {
            return (
              <React.Fragment key={sidebarItem.title}>
                <div className="flex items-center px-1 pt-4 pb-1 list-none h-15 text-md sans text-base">
                  <Tooltip content={sidebarItem.details}>
                    <span>{sidebarItem.title}</span>
                  </Tooltip>
                </div>
                {sidebarItem.type === "traitSearch" && (
                  <div className="flex items-center py-2 pr-3 pl-6 w-full">
                    {/* Dropdown for selecting traits */}
                    <select
                      className="form-select block w-2/5 mb-0 mr-2 text-sm py-2 px-3 rounded-lg border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 flex-grow" 
                      onChange={(e) => handleSearchTraitChange(e.target.value)}
                      aria-label="Select a trait"
                    >
                      {sidebarItem.expandedSidebarItems.map((item, idx) => (
                        <option key={idx} value={item.dbField}>{item.title}</option>
                      ))}
                    </select>
                    {/* Single search box */}
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder="Enter search term..."
                        value={searchTrait.searchTraitValue}
                        onChange={(e) => handleSearchTraitValueChange(e.target.value)}
                        className="form-input block placeholder-italic flex-grow w-3/5 text-xs py-2 px-4 rounded-lg border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                      />
                      {searchTrait.searchTraitValue && (
                        <GrFormClose
                          className="absolute right-3 cursor-pointer"
                          onClick={clearInput}
                        />
                      )}
                    </div>
                  </div>
                )}  
                {sidebarItem.type === "sort" && (
                  <div key={`${sidebarItem.title}`} className="flex items-center p-2 pl-6 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-600 w-full">
                    <div className="grid grid-cols-2 gap-4 w-full">
                      {sidebarItem.expandedSidebarItems.map((expandedSidebarItem, expandedSidebarItemIndex) => (
                        <div key={`${sidebarItem.title}-${expandedSidebarItemIndex}`} className="flex items-center cursor-pointer">
                          <CustomCheckbox
                            id={`${expandedSidebarItem.dbField}-${expandedSidebarItemIndex}`}
                            checked={selectedRareTraitCheckboxes[expandedSidebarItem.dbField] ?? false}
                            onChange={(e) => handleRareTraitCheckboxChange(expandedSidebarItem.dbField, e.target.checked)}
                            label={expandedSidebarItem.title!}
                          />
                        </div>
                      ))} 
                    </div>
                  </div>
                )}
                {sidebarItem.type === "range" && (
                  <div className="flex flex-col p-2 pl-6 pr-3 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-600 w-full">
                    {sidebarItem.expandedSidebarItems.map((expandedSidebarItem, index) => (
                      <div key={index} className="flex items-center space-x-1 mb-2 w-full">
                        <div className="flex items-center flex-1">
                          <CustomCheckbox
                            id={`range-checkbox-${expandedSidebarItem.dbField}`}
                            checked={selectedRareTraitCheckboxes[expandedSidebarItem.dbField]}
                            onChange={(e) => handleCheckboxChange(expandedSidebarItem.dbField, e.target.checked)}
                            label={expandedSidebarItem.title!}
                          />
                        </div>
                        {/* Inputs Container aligned to the left */}
                        <div className="flex items-center space-x-1"> {/* This container holds the min input, dash, and max input */}
                          {/* Min Input */}
                          <input
                            type="text"
                            id={`min-${expandedSidebarItem.dbField}`}
                            value={localRangeValues[expandedSidebarItem.dbField]?.min || ''}
                            onChange={(e) => handleRangeInputChange(expandedSidebarItem.dbField, 'min', e.target.value)}
                            aria-label={`Minimum ${expandedSidebarItem.dbField}`}
                            placeholder={expandedSidebarItem.min}
                            className="form-input text-xs py-2 pl-4 text-right w-[70px] rounded-lg border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                          />
                          <span>-</span> {/* Dash */}
                          {/* Max Input */}
                          <input
                            type="text"
                            id={`max-${expandedSidebarItem.dbField}`}
                            value={localRangeValues[expandedSidebarItem.dbField]?.max || ''}
                            onChange={(e) => handleRangeInputChange(expandedSidebarItem.dbField, 'max', e.target.value)}
                            aria-label={`Maximum ${expandedSidebarItem.dbField}`}
                            placeholder={expandedSidebarItem.max}
                            className="form-input text-xs py-2 pl-4 text-right w-[70px] rounded-lg border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center">
        <button
          className="w-1/2 bg-gray-400 p-2 rounded-lg shadow-sm font-medium text-white hover:bg-gray-500"
          onClick={handleSearchClick}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SidebarPanel;
