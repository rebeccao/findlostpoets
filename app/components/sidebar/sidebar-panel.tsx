import { sidebarItems } from "~/components/sidebar/sidebar-data";
import React, { useState } from 'react';
import { GrFormClose } from "react-icons/gr";
import CustomCheckbox from "~/components/custom-checkbox";
import Tooltip from "~/components/tooltip";
import type { SidebarProps, SearchCriteria } from "~/routes/_index";
import type { ExpandedSidebarItem } from "~/components/sidebar/sidebar-data";

const SidebarPanel: React.FC<SidebarProps> = ({ 
  searchTrait,
  selectedRareTrait, 
  selectedRangeTrait,
  rangeValues, 
  onSearchTraitChange, 
  onRareTraitChange, 
  onRangeTraitSelect,
  onRangeChange,
  performSearch 
}) => {
  console.log("SidebarPanel start");
  
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

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
  const handleSearchTraitValueChange = (newSearchTraitValue: string, selectedTrait: ExpandedSidebarItem) => {
    if (selectedTrait.validationType) {
      const isValidInput = validateSearchTraitInput(selectedTrait.validationType, newSearchTraitValue, selectedTrait);
      if (isValidInput) {
        setErrorMessages(prev => ({ ...prev, [selectedTrait.dbField]: "" }));
        onSearchTraitChange({
          searchTraitKey: selectedTrait.dbField,
          searchTraitValue: newSearchTraitValue,
        });
      } else {
        setErrorMessages(prev => ({ ...prev, [selectedTrait.dbField]: "Invalid input for selected trait" }));
      }
    } else {
      // If no validation type is specified, assume the input is valid
      onSearchTraitChange({
        searchTraitKey: selectedTrait.dbField,
        searchTraitValue: newSearchTraitValue,
      });
    }
  };

  function validateSearchTraitInput(type: string, value: string, trait: ExpandedSidebarItem): boolean {
    switch (type) {
      case 'alphanumeric':
        return /^[a-z0-9]+$/i.test(value);
      case 'alpha':
        return /^[a-zA-Z]+$/.test(value);
      case 'decimal':
        let number = parseFloat(value);
        return !isNaN(number) && number >= parseFloat(trait.min!) && number <= parseFloat(trait.max!);
      case 'fixedLength':
        return value.length === 3; // Assuming the length is 3 for 'Genre'
      case 'enum':
        return trait.enumValues!.includes(value);
      default:
        return true;
    }
  }
  
  const clearSearchTraitInput = () => {
    // Set searchTraitValue  to empty string while keeping the current searchTraitKey
    const updatedSearchTrait = {
      searchTraitKey: searchTrait.searchTraitKey,
      searchTraitValue: '',
    };
    setErrorMessages(prev => ({ ...prev, [searchTrait.searchTraitKey]: "" }));
    onSearchTraitChange(updatedSearchTrait);
  };

  const handleRareTraitChange = (selectedDbField: string) => {
    console.log("Changing rare trait to:", selectedDbField);
    // Directly call the onRareTraitChange prop with the dbField of the clicked checkbox
    onRareTraitChange(selectedDbField); // This function expects a single string or null
  };

  // Update for checkbox change to also clear or set active trait
  const handleRangeCheckboxChange = (selectedDbField: string) => {
    console.log("Changing range trait to:", selectedDbField);
    if (selectedRangeTrait === selectedDbField) {
      onRangeTraitSelect(null); // Deselect if the same trait is clicked again
    } else {
      onRangeTraitSelect(selectedDbField);
    }
  };

  const handleRangeInputChange = (selectedDbField: string, rangeType: 'min' | 'max', value: string) => {
    const numericValue = value === '' ? undefined : Number(value);
    // Check if numericValue is NaN and handle it, e.g., by not updating the state
    if (numericValue !== undefined && isNaN(numericValue)) {
      console.error('Invalid input: Not a number');
      return; // Exit the function early if the input is not a valid number
    }

    if (rangeType === 'min') {
      onRangeChange(selectedDbField, numericValue, rangeValues[selectedDbField]?.max);
    } else {
      onRangeChange(selectedDbField, rangeValues[selectedDbField]?.min, numericValue);
    }
  };

  const resetSearch = () => {
    // Set searchTraitValue  to empty string while keeping the current searchTraitKey
    //if (searchTrait.searchTraitValue !== '') {
      clearSearchTraitInput();
    //}

    // Deselect the selected rare trait, if any
    if (selectedRareTrait) {
      onRareTraitChange(null);
    }

    // Reset the selected range trait and clear min/max values
    if (selectedRangeTrait) {
      onRangeChange(null, undefined, undefined);
    }

    const dbQuery: SearchCriteria = {  orderBy: [{ pid: 'asc' }], skip: 0 };
    console.log("SidebarPanel: resetSearch dbQuery: ", dbQuery);
    performSearch(dbQuery);
  };

  // Handler for the search button click
  const handleSearchClick = () => {
    let dbQuery: SearchCriteria = { skip: 0 };
    let whereConditions: any[] = [];
    let orderByConditions: SearchCriteria['orderBy'] = [];
  
    // Search By Trait
    if (searchTrait.searchTraitValue) {
      const trimmedSearchValue = searchTrait.searchTraitValue.trim();
  
      if (trimmedSearchValue !== '') {
        whereConditions.push({
          [searchTrait.searchTraitKey]: { equals: trimmedSearchValue, mode: "insensitive" }
        });
      }
    }

    // Sort By Rare Trait
    if(selectedRareTrait) {
      const trait = selectedRareTrait.slice(0, -3);

      whereConditions.push({ [selectedRareTrait]: { gt: 0 } });
      orderByConditions.push({ [selectedRareTrait]: 'asc' })
      orderByConditions.push({ [trait]: 'asc' })                // sort the actual trait after sorting the trait count
    }

    // Sort By Range Trait
    if (selectedRangeTrait && rangeValues[selectedRangeTrait]) {
      interface RangeCondition {
        gte?: number;
        lte?: number;
      }

      const rangeCondition: RangeCondition = {};
      if (rangeValues[selectedRangeTrait].min !== undefined) {
          rangeCondition['gte'] = rangeValues[selectedRangeTrait].min;
      }
      if (rangeValues[selectedRangeTrait].max !== undefined) {
          rangeCondition['lte'] = rangeValues[selectedRangeTrait].max;
      }
      if (Object.keys(rangeCondition).length > 0) {
          whereConditions.push({ [selectedRangeTrait]: rangeCondition });
          orderByConditions.push({ [selectedRangeTrait]: 'desc' }) 
      }
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

  return (
    <div className="flex flex-col h-screen">
      <div className="h-screen pb-14 overflow-y-auto scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="py-4 pt-navbar">
          {sidebarItems.map((sidebarItem, index) => {
            return (
              <React.Fragment key={sidebarItem.title}>
                <div className="flex items-center px-4 pt-4 pb-1 list-none h-15 text-md sans text-base">
                  <Tooltip content={sidebarItem.details}>
                    <span>{sidebarItem.title}</span>
                  </Tooltip>
                </div>
                {sidebarItem.type === "traitSearch" && (
                  <div className="flex items-center py-2 pr-3 pl-6 w-full">
                    {/* Dropdown for selecting traits */}
                    <select
                      className="form-select block w-2/5 mb-0 mr-2 text-xs py-2 px-3 rounded-lg border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 flex-grow" 
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
                        onChange={(e) => {
                          const selectedTrait = sidebarItem.expandedSidebarItems.find(item => item.dbField === searchTrait.searchTraitKey);
                          if (selectedTrait) {
                            handleSearchTraitValueChange(e.target.value, selectedTrait);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault(); // Prevent default form submission if applicable
                            const selectedTrait = sidebarItem.expandedSidebarItems.find(item => item.dbField === searchTrait.searchTraitKey);
                            if (selectedTrait) {
                              handleSearchTraitValueChange('', selectedTrait); // Clear the input box by setting its value to an empty string
                            }
                            handleSearchClick(); // Call the search handler when Enter key is pressed
                            clearSearchTraitInput(); // Move this inside if you need to clear after search
                          }
                        }}
                        className="form-input block placeholder-italic flex-grow w-3/5 text-xs py-2 px-4 rounded-lg border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                      />
                      {errorMessages[searchTrait.searchTraitKey] && (
                        <div className="text-red-500 text-xs mt-1 pl-4">{errorMessages[searchTrait.searchTraitKey]}</div>
                      )}
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
                      {sidebarItem.expandedSidebarItems.map((expandedSidebarItem, index) => (
                        <div key={`${sidebarItem.title}-${index}`} className="flex items-center cursor-pointer">
                          <CustomCheckbox
                            id={`sort-${expandedSidebarItem.dbField}-${index}`}
                            checked={selectedRareTrait === expandedSidebarItem.dbField}
                            onChange={() => handleRareTraitChange(expandedSidebarItem.dbField)}
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
                      <div key={`${sidebarItem.title}-${index}`} className="flex items-center space-x-1 mb-2 w-full">
                        <div className="flex items-center flex-1">
                          <CustomCheckbox
                            id={`range-${expandedSidebarItem.dbField}-${index}`}
                            checked={selectedRangeTrait === expandedSidebarItem.dbField}
                            onChange={() => handleRangeCheckboxChange(expandedSidebarItem.dbField)}
                            label={expandedSidebarItem.title!}
                          />
                        </div>
                        {/* Inputs Container aligned to the left */}
                        <div className="flex items-center space-x-1"> {/* This container holds the min input, dash, and max input */}
                          {/* Min Input */}
                          <input
                            type="number"
                            pattern="\d"
                            id={`min-${expandedSidebarItem.dbField}-${index}`}
                            value={rangeValues[expandedSidebarItem.dbField]?.min || ''}
                            onChange={(e) => handleRangeInputChange(expandedSidebarItem.dbField, 'min', e.target.value)}
                            onKeyDown={(e) => {
                              // Allow only digits and control keys
                              if (!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab", "Enter"].includes(e.key) && !e.ctrlKey) {
                                e.preventDefault();
                              }
                            }}
                            aria-label={`Minimum ${expandedSidebarItem.dbField}`}
                            placeholder={expandedSidebarItem.min}
                            className="form-input text-xs py-2 pl-4 text-right w-[70px] rounded-lg border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                          />
                          <span>-</span> {/* Dash */}
                          {/* Max Input */}
                          <input
                            type="number"
                            pattern="\d"
                            id={`max-${expandedSidebarItem.dbField}-${index}`}
                            value={rangeValues[expandedSidebarItem.dbField]?.max || ''}
                            onChange={(e) => handleRangeInputChange(expandedSidebarItem.dbField, 'max', e.target.value)}
                            onKeyDown={(e) => {
                              // Allow only digits and control keys
                              if (!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab", "Enter"].includes(e.key) && !e.ctrlKey) {
                                e.preventDefault();
                              }
                            }}
                            aria-label={`Maximum ${expandedSidebarItem.dbField}`}
                            placeholder={expandedSidebarItem.max}
                            className="form-input text-xs py-2 pl-4 text-right w-[70px] rounded-lg border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
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
          className="w-1/4 bg-gray-600 border-gray-300 p-2 rounded-lg shadow-sm font-medium text-white hover:bg-gray-700" // Darker for primary action
          onClick={handleSearchClick}
        >
          Search
        </button>
        <button
          className="w-1/4 bg-gray-400 border-gray-300 p-2 rounded-lg shadow-sm font-medium text-white hover:bg-gray-500" // Lighter for secondary clear action
          onClick={resetSearch} // Assuming this resets all search inputs
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SidebarPanel;
