import { sidebarItems } from "~/components/sidebar/sidebar-data";
import React, { useState } from "react";
import { GrFormClose } from "react-icons/gr";
import CustomCheckbox from "~/components/custom-checkbox";
import Tooltip from "~/components/tooltip";
import type { SidebarProps, SearchCriteria } from "~/routes/_index";

const SidebarPanel: React.FC<SidebarProps> = ({ 
  searchTrait,
  selectedRareTrait, 
  selectedRanges, 
  onSearchTraitChange, 
  onRareTraitChange, 
  onRangeChange,
  performSearch 
}) => {
  console.log("SidebarPanel start");

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

  const clearSearchTraitInput = () => {
    // Set searchTraitValue  to empty string while keeping the current searchTraitKey
    const updatedSearchTrait = {
      searchTraitKey: searchTrait.searchTraitKey,
      searchTraitValue: '',
    };
    onSearchTraitChange(updatedSearchTrait);
  };

  const handleRareTraitChange = (dbField: string, isChecked: boolean) => {
    const updatedSelections = { ...selectedRareTrait, [dbField]: isChecked };

    onRareTraitChange(updatedSelections);   // Update the selected checkboxes state
  };

  const resetSearch = () => {
    // Set searchTraitValue  to empty string while keeping the current searchTraitKey
    if (searchTrait.searchTraitValue !== '') {
      const updatedSearchTrait = {
        searchTraitKey: searchTrait.searchTraitKey,
        searchTraitValue: '',
      };
      onSearchTraitChange(updatedSearchTrait);
    }

    const dbQuery: SearchCriteria = {  orderBy: [{ pid: 'asc' }] };
    console.log("SidebarPanel: resetSearch dbQuery: ", dbQuery);
    performSearch(dbQuery);
  };

  // Handler for the search button click
  const handleSearchClick = () => {
    let dbQuery: SearchCriteria = {};
    let whereConditions: any[] = [];
    let orderByConditions: SearchCriteria['orderBy'] = [];
  
    if (searchTrait.searchTraitValue) {
      const trimmedSearchValue = searchTrait.searchTraitValue.trim();
  
      if (trimmedSearchValue !== '') {
        whereConditions.push({
          [searchTrait.searchTraitKey]: { equals: trimmedSearchValue, mode: "insensitive" }
        });
      }
    }
    const selectedFields = Object.entries(selectedRareTrait)
      .filter(([_, value]) => value)
      .map(([key]) => key);
  
    if (selectedFields.length > 0) {
      selectedFields.forEach(field => {
        whereConditions.push({ [field]: { gt: 0 } });
        orderByConditions.push({ [field]: 'asc' });
      });
    }
  
    if (whereConditions.length > 0) {
      dbQuery.where = { AND: whereConditions };
    }
  
    if (orderByConditions.length > 0) {
      dbQuery.orderBy = orderByConditions;
    } else {
      // Apply default orderBy if no other orderBy conditions are specified
      dbQuery.orderBy = [{ pid: 'asc' }];
    }
  
    console.log("SidebarPanel: handleSearchClick dbQuery: ", dbQuery);
    performSearch(dbQuery);
  };

  const [localRangeValues, setLocalRangeValues] = useState<Record<string, { min: string; max: string }>>({});

  const handleRangeInputChange = (dbField: string, rangeType: 'min' | 'max', value: string) => {
    setLocalRangeValues(prev => ({
        ...prev,
        [dbField]: { ...prev[dbField], [rangeType]: value },
    }));
    console.log("handleRangeInputChange: localRangeValues = ", localRangeValues)
  };

  const handleRangeCheckboxChange = (dbField: string, isChecked: boolean) => {
    const updatedSelections = { ...selectedRareTrait, [dbField]: isChecked };

    onRareTraitChange(updatedSelections);   // Update the selected checkboxes state
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
                          onClick={clearSearchTraitInput}
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
                            id={`sort-${expandedSidebarItem.dbField}-${expandedSidebarItemIndex}`}
                            checked={selectedRareTrait[expandedSidebarItem.dbField] ?? false}
                            onChange={(e) => handleRareTraitChange(expandedSidebarItem.dbField, e.target.checked)}
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
                            id={`range-${expandedSidebarItem.dbField}-${index}`}
                            checked={selectedRareTrait[expandedSidebarItem.dbField]}
                            onChange={(e) => handleRangeCheckboxChange(expandedSidebarItem.dbField, e.target.checked)}
                            label={expandedSidebarItem.title!}
                          />
                        </div>
                        {/* Inputs Container aligned to the left */}
                        <div className="flex items-center space-x-1"> {/* This container holds the min input, dash, and max input */}
                          {/* Min Input */}
                          <input
                            type="text"
                            id={`min-${expandedSidebarItem.dbField}-${index}`}
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
                            id={`max-${expandedSidebarItem.dbField}-${index}`}
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
      <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center space-x-2">
        <button
          className="w-1/4 bg-gray-600 p-2 rounded-lg shadow-sm font-medium text-white hover:bg-gray-700" // Darker for primary action
          onClick={handleSearchClick}
        >
          Search
        </button>
        <button
          className="w-1/4 bg-gray-400 p-2 rounded-lg shadow-sm font-medium text-white hover:bg-gray-500" // Lighter for secondary clear action
          onClick={resetSearch} // Assuming this resets all search inputs
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SidebarPanel;
