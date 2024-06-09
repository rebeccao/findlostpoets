import { sidebarItems } from "~/components/sidebar/sidebar-data";
import React, { useState, useRef } from 'react';
import { GrFormClose } from "react-icons/gr";
import CustomCheckbox from "~/components/custom-checkbox";
import Tooltip from "~/components/tooltip";
import type { SidebarProps, SearchCriteria } from "~/routes/_index";
import type { ExpandedSidebarItem } from "~/components/sidebar/sidebar-data";
import { FloatingError } from "~/components/floating-error";

const SidebarPanel: React.FC<SidebarProps> = React.memo(({ 
  selectedClasses,
  searchTrait,
  selectedRareTrait, 
  selectedRangeTrait,
  rangeValues,
  onClassChange, 
  onSearchTraitChange, 
  onRareTraitChange, 
  onRangeTraitSelect,
  onRangeChange,
  performSearch 
}) => {
  
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  // Handler for changing the searchTrait
  const handleSearchTraitChange = (newSearchTraitKey: string) => {
    // Update the searchTraitKey and clear the searchTraitValue
    const updatedSearchTrait = {
      searchTraitKey: newSearchTraitKey,
      searchTraitValue: '',
    };
    onSearchTraitChange(updatedSearchTrait);
  };

  // Handler for changing the searchTrait Value
  const handleSearchTraitValueChange = (newSearchTraitValue: string, selectedTrait: ExpandedSidebarItem) => {
    let isValidInput = true;
    let finalValue: string | number = newSearchTraitValue;  // finalValue can be string or number

    // Perform type-specific validation if a validation type is specified
    if (selectedTrait.validationType) {
      isValidInput = validateSearchTraitInput(selectedTrait.validationType, newSearchTraitValue, selectedTrait);
    }

    // Check if the input is for "Poet Name" and if a number was entered
    if (selectedTrait.dbField === 'pNam') {
      if (!isNaN(Number(newSearchTraitValue))) {
          // Prepend the required prefix
          finalValue = `#${newSearchTraitValue}`;
      } else {
          isValidInput = /^[a-z0-9# ]+$/i.test(newSearchTraitValue);
      }
    } else if (selectedTrait.validationType) {
        // Perform type-specific validation if a validation type is specified
        isValidInput = validateSearchTraitInput(selectedTrait.validationType, newSearchTraitValue, selectedTrait);
    }

    // Handle input types for additional checks
    if (selectedTrait.inputType === 'number') {
      // Allow decimal point and leading zeros
      if (newSearchTraitValue === '.' || newSearchTraitValue.endsWith('.') || newSearchTraitValue === '0.' || newSearchTraitValue === '0.0') {
        finalValue = newSearchTraitValue;
      } else {
        // Convert the input to a number and check if it's a valid number within the specified range (if any)
        const numberValue = Number(newSearchTraitValue);
        isValidInput = !isNaN(numberValue) && validateNumberInput(numberValue, selectedTrait);
        if (isValidInput || newSearchTraitValue === '0' || newSearchTraitValue === '0.0' || newSearchTraitValue === '') {
          finalValue = newSearchTraitValue;  // Keep as string to maintain input value
        } else {
          isValidInput = false;
        }
      }
    }

    onSearchTraitChange({
      searchTraitKey: selectedTrait.dbField,
      searchTraitValue:  finalValue,
    });

    if (isValidInput || newSearchTraitValue === '') {
      setErrorMessages(prev => ({ ...prev, [selectedTrait.dbField]: "" }));
    } else {
      const errorMessage = generateErrorMessage(selectedTrait);
      setErrorMessages(prev => ({ ...prev, [selectedTrait.dbField]: errorMessage }));
    }
  };

  function validateSearchTraitInput(type: string, value: string, trait: ExpandedSidebarItem): boolean {
    switch (type) {
      case 'alphanumeric':
        return /^[a-z0-9# ]+$/i.test(value);
      case 'alpha':
        return /^[a-zA-Z]+$/.test(value);
      case 'decimal':
        if (value === '.' || value.endsWith('.') || value === '0.' || value === '') {
          return true;  // Allow initial decimal point and empty string
        }
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

  function validateNumberInput(numberValue: number, trait: ExpandedSidebarItem) {
    // Check the number against the defined min and max values if any
    if (trait.min !== undefined && numberValue < Number(trait.min)) return false;
    if (trait.max !== undefined && numberValue > Number(trait.max)) return false;
    return true;
  }

  function generateErrorMessage(trait: ExpandedSidebarItem) {
    // Generate specific error messages based on the input and validation type
    switch (trait.validationType) {
      case 'decimal':
        return `Please enter a valid number within the range ${trait.min} to ${trait.max}.`;
      case 'alphanumeric':
        return 'Only alphanumeric characters are allowed.';
      case 'alpha':
        return 'Only alphabetic characters are allowed.';
      case 'enum':
        return `Please select from the available options: ${trait.enumValues?.join(', ')}.`;
      default:
        return 'Invalid input for selected trait.';
    }
  }
  
  const clearSearchTraitInput = () => {
    // Set searchTraitValue  to empty string while keeping the current searchTraitKey
    const updatedSearchTrait = {
      searchTraitKey: searchTrait.searchTraitKey.toString(),
      searchTraitValue: '',
    };
    setErrorMessages(prev => ({ ...prev, [searchTrait.searchTraitKey]: "" }));
    onSearchTraitChange(updatedSearchTrait);
  };

  const handleClassChange = (selectedDbField: string) => {
    console.log("Changing class to:", selectedDbField);
    const updatedClasses = selectedClasses?.includes(selectedDbField)
        ? selectedClasses.filter(field => field !== selectedDbField)
        : [...(selectedClasses || []), selectedDbField];
    onClassChange(updatedClasses);  // Pass the updated array
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

    if (rangeType === 'min') {
      onRangeChange(selectedDbField, numericValue, rangeValues[selectedDbField]?.max);
    } else {
      onRangeChange(selectedDbField, rangeValues[selectedDbField]?.min, numericValue);
    }
  };

  const resetSearch = () => {
    // Clear the search term input field and reset its placeholder
    if (inputRef.current) {
      //inputRef.current.value = '';
      inputRef.current.placeholder = 'Enter search term...';
    }
    clearSearchTraitInput();

    // Deselect the selected classes, if any
    if (selectedClasses) {
      onClassChange([]);
    }

    // Deselect the selected rare trait, if any
    if (selectedRareTrait) {
      onRareTraitChange(null);
    }

    // Reset the selected range trait and clear min/max values
    if (selectedRangeTrait) {
      onRangeChange(null, undefined, undefined);
    }

    // Reset all range input fields to their placeholders
    // ToDo: Confirm this works
    sidebarItems.forEach((sidebarItem) => {
      sidebarItem.expandedSidebarItems.forEach((item) => {
        if (inputRefs.current[`min-${item.dbField}`]) {
          const inputElement = inputRefs.current[`min-${item.dbField}`];
          if (inputElement) {
            inputElement.value = '';
            inputElement.placeholder = item.min || '';
          }
        }
        if (inputRefs.current[`max-${item.dbField}`]) {
          const inputElement = inputRefs.current[`max-${item.dbField}`];
          if (inputElement) {
            inputElement.value = '';
            inputElement.placeholder = item.max || '';
          }
        }
      });
    });

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
    if (searchTrait.searchTraitValue || searchTrait.searchTraitValue === 0) { // Ensure zero is considered a valid number
      const searchValue = searchTrait.searchTraitValue;
      // ToDo: Confirm this works
      if (searchTrait.searchTraitKey === 'age') {
        whereConditions.push({
          [searchTrait.searchTraitKey]: { equals: Number(searchValue) }
        });
      } else if (searchValue !== '') {
        whereConditions.push({
          [searchTrait.searchTraitKey]: { equals: searchValue, mode: "insensitive" }
        });
      }
    }

    // Sort By Rare Trait
    if(selectedRareTrait) {
      const trait = selectedRareTrait.slice(0, -3);

      whereConditions.push({ [selectedRareTrait]: { gt: 0 } });
      orderByConditions.push({ [selectedRareTrait]: 'asc' });
      orderByConditions.push({ [trait]: 'asc' });                // sort the actual trait after sorting the trait count
      orderByConditions.push({ ['pid']: 'asc' });                // Ensure sorting by pid
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
          orderByConditions.push({ [selectedRangeTrait]: 'asc' }); 
          orderByConditions.push({ 'pid': 'asc' });             // Ensure sorting by pid
      }
    }

    // Sort By Classes
    if (selectedClasses && selectedClasses.length > 0) {
      whereConditions.push({ class: { in: selectedClasses } }); // Use 'in' to match any of the selected classes
      orderByConditions.push({ pid: 'asc' });                   // Ensure sorting by pid             
    }
  
    if (whereConditions.length > 0) {
      dbQuery.where = { AND: whereConditions };
    }

    // Ensure only one { pid: 'asc' } in orderByConditions
    const uniqueOrderByConditions: { [key: string]: 'asc' | 'desc' }[] = [];
    const seenOrderByKeys = new Set<string>();

    for (const condition of orderByConditions) {
        const key = Object.keys(condition)[0];
        if (!seenOrderByKeys.has(key)) {
            uniqueOrderByConditions.push(condition);
            seenOrderByKeys.add(key);
        }
    }
  
    if (uniqueOrderByConditions.length > 0) {
      dbQuery.orderBy = uniqueOrderByConditions;
    } else {
        // Apply default orderBy if no other orderBy conditions are specified
        dbQuery.orderBy = [{ pid: 'asc' }];
    }
  
    console.log("SidebarPanel: handleSearchClick dbQuery: ", dbQuery);
    performSearch(dbQuery);
  };

  return (
    <div className="flex flex-col h-full relative border bg-verydarkgray border-darkgray">
      <div className="flex-grow overflow-y-auto scrollbar scrollbar-onyxgray scrollbar-track-charcoalgray">
        <div className="pt-4 pb-4 font-light">
          {sidebarItems.map((sidebarItem, index) => {
            return (
              <React.Fragment key={sidebarItem.title}>
                <div className="flex items-center px-4 pt-4 pb-1 sans text-gainsboro text-base">
                  <Tooltip content={sidebarItem.details}>
                    <span>{sidebarItem.title}</span>
                  </Tooltip>
                </div>
                {sidebarItem.type === "class" && (
                  <div key={`${sidebarItem.title}`} className="flex items-center p-2 pl-6 text-sm rounded w-full">
                    <div className="grid grid-cols-3 gap-4 w-full">
                      {sidebarItem.expandedSidebarItems.map((expandedSidebarItem, index) => (
                        <div key={`${sidebarItem.title}-${index}`} className="flex items-center cursor-pointer">
                          <CustomCheckbox
                            id={`class-${expandedSidebarItem.dbField}-${index}`}
                            checked={selectedClasses?.includes(expandedSidebarItem.dbField) || false}
                            onChange={() => handleClassChange(expandedSidebarItem.dbField)}
                            label={expandedSidebarItem.title!}
                          />
                        </div>
                      ))} 
                    </div>
                  </div>
                )}
                {sidebarItem.type === "traitSearch" && (
                  <div className="relative flex items-center py-2 pr-3 pl-6 w-full">
                    {/* Dropdown for selecting traits */}
                    <select
                      id="traitSelect"  
                      name="traitSelect"
                      className="form-select block w-[40%] flex-shrink-0 flex-grow-0 flex-basis-[40%] mr-2 text-sm py-2 px-2 rounded-lg text-pearlwhite focus:outline-none bg-davysgray border-naughtygray focus:border-davysgray focus:ring-1 focus:ring-naughtygray" 
                      onChange={(e) => handleSearchTraitChange(e.target.value)}
                      aria-label="Select a trait"
                    >
                      {sidebarItem.expandedSidebarItems.map((item, idx) => (
                        <option key={idx} value={item.dbField}>{item.title}</option>
                      ))}
                    </select>
                    {/* Single search box */}
                    <div className="relative flex items-center w-[60%] flex-shrink-0 flex-grow-0 flex-basis-[60%] pr-3">
                      <input
                        id="searchTerm"  
                        name="searchTerm"
                        type="text"
                        placeholder="Enter search term..."
                        ref={inputRef} 
                        value={searchTrait.searchTraitValue}
                        className="form-input block w-full py-2 text-sm rounded-lg placeholder-italic placeholder-mediumgray text-pearlwhite bg-davysgray border-naughtygray focus:border-davysgray focus:ring-1 focus:ring-naughtygray"
                        onFocus={(e) => e.target.placeholder = ''} // Clear placeholder on focus
                        onBlur={(e) => {
                          if (e.target.value === '') {
                              e.target.placeholder = "Enter search term..."; // Restore placeholder if input is empty
                          }
                        }}
                        onChange={(e) => {
                          const selectedTrait = sidebarItem.expandedSidebarItems.find(item => item.dbField === searchTrait.searchTraitKey);
                          if (selectedTrait) {
                            handleSearchTraitValueChange(e.target.value, selectedTrait);
                          }
                        }}
                        onKeyDown={(e) => {
                          const selectedTrait = sidebarItem.expandedSidebarItems.find(item => item.dbField === searchTrait.searchTraitKey);
                          if (selectedTrait?.inputType === 'number' && !/[\d.]/.test(e.key) && e.key !== 'Enter' && e.key !== '.' && e.key !== 'Backspace') {
                            e.preventDefault(); // Allow only digits, backspace, and decimal point for numbers
                          }
                          if (e.key === 'Enter') {
                            e.preventDefault(); // Prevent default form submission if applicable
                            handleSearchClick(); // Call the search handler when Enter key is pressed
                          }
                        }}
                      />
                      {errorMessages[searchTrait.searchTraitKey] && (
                        <FloatingError
                          message={errorMessages[searchTrait.searchTraitKey]}
                          onClose={() => setErrorMessages(prev => ({ ...prev, [searchTrait.searchTraitKey]: '' }))}
                        />
                      )}
                      {searchTrait.searchTraitValue && (
                        <GrFormClose
                          className="absolute right-3 cursor-pointer"
                          onClick={() => {
                            clearSearchTraitInput();
                            inputRef.current?.focus(); // Focus the input field after clearing
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
                {sidebarItem.type === "sort" && (
                  <div key={`${sidebarItem.title}`} className="flex items-center p-2 pl-6 text-sm rounded w-full">
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
                  <div className="flex flex-col p-2 pl-6 pr-3 text-sm rounded w-full">
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
                            ref={(el) => (inputRefs.current[`min-${expandedSidebarItem.dbField}`] = el)}
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
                            onFocus={(e) => e.target.placeholder = ''} // Clear placeholder on focus
                            onBlur={(e) => {
                              if (e.target.value === '') {
                                  e.target.placeholder = expandedSidebarItem.min || ''; // Restore placeholder if input is empty
                              }
                            }}
                            className="form-input text-xs p-2 text-center w-[70px] rounded-lg placeholder-italic border placeholder-mediumgray text-pearlwhite bg-davysgray border-naughtygray focus:border-davysgray focus:ring-1 focus:ring-naughtygray"
                          />
                          <span>-</span> {/* Dash */}
                          {/* Max Input */}
                          <input
                            type="number"
                            pattern="\d"
                            id={`max-${expandedSidebarItem.dbField}-${index}`}
                            ref={(el) => (inputRefs.current[`max-${expandedSidebarItem.dbField}`] = el)}
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
                            onFocus={(e) => e.target.placeholder = ''} // Clear placeholder on focus
                            onBlur={(e) => {
                              if (e.target.value === '') {
                                  e.target.placeholder = expandedSidebarItem.max || ''; // Restore placeholder if input is empty
                              }
                            }}
                            className="form-input text-xs p-2 text-center w-[70px] rounded-lg placeholder-italic placeholder-mediumgray text-pearlwhite bg-davysgray border-naughtygray focus:border-davysgray focus:ring-1 focus:ring-naughtygray"
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
        {/* Buttons Container */}
        <div className="sticky bottom-0 p-4 font-light flex justify-center space-x-2">
          <button
            className="w-1/4 p-2 rounded-lg shadow-sm text-white border bg-davysgray border-naughtygray hover:bg-darkgray hover:border-charcoalgray"// Lighter for secondary clear action
            onClick={handleSearchClick}
          >
            Search
          </button>
          <button
            className="w-1/4 p-2 rounded-lg shadow-sm text-white border bg-charcoalgray border-gunmetalgray hover:bg-darkgray hover:border-charcoalgray" // Darker for primary action
            onClick={resetSearch} // Assuming this resets all search inputs
          >
            Clear
          </button>
        </div>
      </div>
      
    </div>
  );
});

export default SidebarPanel;
