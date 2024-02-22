import { sidebarItems } from "~/components/sidebar/sidebar-data";
import React, { useState } from "react";
//import { BiSearch, BiSolidChevronDown, BiSolidChevronUp } from "react-icons/bi";
import { GrFormClose } from "react-icons/gr";
import type { SidebarProps } from "~/routes/_index";
import CustomCheckbox from "~/components/custom-checkbox";

const SidebarPanel: React.FC<SidebarProps> = ({ 
  selectedRareTraitCheckboxes, 
  searchTexts,
  selectedRanges, 
  onRareTraitCheckboxChange, 
  onSearchTextChange, 
  onRangeChange,
  onSelectionChange 
}) => {
  console.log("SidebarPanel start");

  const handleCheckboxChange = (dbField: string, isChecked: boolean) => {
    const updatedSelections = { ...selectedRareTraitCheckboxes, [dbField]: isChecked };

    // Update the selected checkboxes state
    onRareTraitCheckboxChange(updatedSelections);
  };

  // Checkbox search. Selecting and unselecting checkbox trigger DB search
  const handleRareTraitCheckboxChange = (dbField: string, isChecked: boolean) => {
    const updatedSelections = { ...selectedRareTraitCheckboxes, [dbField]: isChecked };

    // Update the selected checkboxes state
    onRareTraitCheckboxChange(updatedSelections);
/*
    const selectedFields = Object.entries(updatedSelections)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (selectedFields.length > 0) {
      // Construct where conditions for each selected checkbox
      const whereConditions = selectedFields.map(field => ({
        [field]: { gt: 0 }
      }));

      // Assuming you want to order by the first selected checkbox for simplicity
      // Modify this as needed to support more complex ordering logic
      const orderBy = selectedFields.map(field => ({ [field]: 'asc' }));

      const dbQuery = {
        where: {
          AND: whereConditions,
        },
        orderBy,
      };

      onSelectionChange(dbQuery);
    } else {
      // If no checkboxes are selected, revert to default query
      onSelectionChange({ orderBy: { pid: 'asc' } });
    }*/
  };

  // Text Search: Magnifying glass and <return> onClick handlers to trigger DB search
  const handleSearchText = (dbField: string, value: string) => {
    // Update the searchTexts state with the new value, but only if it's not empty or whitespace
    if (value.trim().length > 0 || dbField === '') {
      const trimmedValue = value.trim();
      const newSearchTexts = { ...searchTexts, [dbField]: trimmedValue };
      onSearchTextChange(newSearchTexts);
      
      const whereConditions = Object.entries(newSearchTexts).reduce<{ [key: string]: { equals: string; mode: 'insensitive' } }[]>((acc, [key, val]) => {
        if (val.trim()) {
          acc.push({ [key]: { equals: val, mode: "insensitive" } });
        }
        return acc;
      }, []);    // The initial value of the accumulator is an empty array
    
      if (whereConditions.length > 0) {
        // Construct the complex DB query with all the where conditions
        const dbQuery = {
          where: {
            OR: whereConditions,
          },
        };
    
        console.log("SidebarPanel: handleSearchText dbQuery: ", dbQuery);
        onSelectionChange(dbQuery);
      }
    } else if (dbField === '' && value === '') {
      // Handle case for clearing the search without a specific field
      onSelectionChange({});
    }
  };

  // Text Search: `x` onClick handler to trigger DB search
  const clearInput = (dbField: string) => {
    const newSearchTexts = { ...searchTexts };
    delete newSearchTexts[dbField]; // Remove the specific field from searchTexts
    onSearchTextChange(newSearchTexts);
  
    // Trigger a default search if all text inputs are cleared
    // Check if searchTexts is empty to decide whether to revert to default search
    if (Object.keys(newSearchTexts).length === 0) {
      onSelectionChange({ orderBy: { pid: 'asc' } });
    } else {
      // If other search texts exist, trigger search with remaining conditions
      handleSearchText('', '');
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
/*
  // Intermediary function to validate and handle cases where the input is empty by resetting it to a default value
  function handleInputChange(dbField: string, rangeType: 'min' | 'max', value: string, defaultValue: string) {
    if (value.trim() !== '') {
      handleRangeInputChange(dbField, rangeType, value);
    } else {
      // Reset to the provided default value (e.g., rangeItem.min) if the input is empty
      handleRangeInputChange(dbField, rangeType, defaultValue);
    }
  }*/

  interface QueryStructure {
    [key: string]: { gte: number | undefined; lte: number | undefined };
  }
  
  const submitRange = () => {
    const dbQuery: QueryStructure = Object.keys(localRangeValues).reduce((acc, key) => {
      const { min, max } = localRangeValues[key];
      acc[key] = {
        gte: min ? parseFloat(min) : undefined, // Convert to float or use undefined
        lte: max ? parseFloat(max) : undefined, // Convert to float or use undefined
      };
      return acc;
    }, {} as QueryStructure); // Type assertion here
    onSelectionChange(dbQuery);
  };
/*
  const submitRange = (dbField: string) => {
    // Get the current values for min and max from local state
    const currentRange = localRangeValues[dbField];
    if (!currentRange) return;

    // Convert string values to numbers or fallback to undefined if conversion fails or if the string is empty
    const min = currentRange.min ? parseFloat(currentRange.min) : undefined;
    const max = currentRange.max ? parseFloat(currentRange.max) : undefined;

    // Update the local state in the Index component to reflect the new range selection
    onRangeChange({
        ...rangeSelections, // Previous state
        [dbField]: { min, max }, // Update specific range
    });

    const dbQuery = Object.keys(localRangeValues).reduce((acc, key) => {
      const { min, max } = localRangeValues[key];
      // Directly parse min and max to float without fallback to undefined
      acc[key] = {
          gte: parseFloat(min), // Assuming min and max are always provided as strings
          lte: parseFloat(max),
      };
      return acc;
  }, {});

  // Now dbQuery should correctly reflect the structured criteria for the database query
  onRangeChange(dbQuery); // Assuming this is the correct handler to update state or trigger actions

    // Assuming you need to fetch data based on this range
    // Construct a query object to be used for fetching data
    const dbQuery = {
        where: {
            AND: [{ [dbField]: { gte: min, lte: max } }],
        },
        orderBy: {
            [dbField]: 'desc',
        },
    };

    // Trigger data fetching with the constructed query
    onSelectionChange(dbQuery);
  };   */

  return (
    <div className="h-screen overflow-y-auto scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div className="py-4">
        {sidebarItems.map((sidebarItem, index) => {
          return (
            <React.Fragment key={sidebarItem.title}>
              <div
                className="flex items-center px-1 py-1 list-none h-15 text-md sans text-base"
              >
                <span className="ml-4">{sidebarItem.title}</span>
              </div>
              {sidebarItem.expandedSidebarItems.map((expandedSidebarItem, expandedSidebarItemIndex) => (
                <div
                  key={`${sidebarItem.title}-${expandedSidebarItemIndex}`}
                  className="flex items-center p-2 pl-8 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-600 w-full"
                >
                  {sidebarItem.type === "traitSearch" && (
                    <div className="flex items-center space-x-2 w-full">
                      <div className="flex items-center flex-1">
                        <CustomCheckbox
                          id={expandedSidebarItemIndex.toString()}
                          checked={selectedRareTraitCheckboxes[expandedSidebarItem.dbField]}
                          onChange={(e) => handleCheckboxChange(expandedSidebarItem.dbField, e.target.checked)}
                          label={expandedSidebarItem.title!}
                        />
                      </div>
                      <div className="flex items-center space-x-1"> {/* Text to search input */}
                        <input
                          type="text"
                          id={`max-${expandedSidebarItem.dbField}`}
                          value={localRangeValues[expandedSidebarItem.dbField]?.max || ''}
                          onChange={(e) => handleRangeInputChange(expandedSidebarItem.dbField, 'max', e.target.value)}
                          aria-label={`Maximum ${expandedSidebarItem.dbField}`}
                          className="form-input text-xs py-2 pl-4 w-40 rounded-lg border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                        />
                      </div>
                    </div>
                  )}
                  {sidebarItem.type === "oldTraitSearch" && (
                    <div className="flex items-center space-x-2 w-full">
                      <div className="flex items-center flex-1">
                        {expandedSidebarItem.title!}
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
                          className="form-input text-xs py-2 pl-4 w-20 rounded-lg border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                        />
                      </div>
                    </div>
                  )}
                  {sidebarItem.type === "sort" && (
                    <label className="w-full flex items-center cursor-pointer" htmlFor={expandedSidebarItemIndex.toString()}>
                    <input
                      id={expandedSidebarItemIndex.toString()}
                      type="checkbox"
                      value={expandedSidebarItem.dbField}
                      checked={selectedRareTraitCheckboxes[expandedSidebarItem.dbField] ?? false} 
                      onChange={(e) => handleRareTraitCheckboxChange(expandedSidebarItem.dbField, e.target.checked)}
                      className="opacity-0 absolute h-4 w-4"
                    />
                    <span className={`ml-1 w-4 h-4 rounded-sm shadow-sm flex justify-center items-center mr-2 ${selectedRareTraitCheckboxes[expandedSidebarItem.dbField] ? 'bg-gray-400 border-gray-700' : 'bg-white border border-gray-200'}`}>
                      {selectedRareTraitCheckboxes[expandedSidebarItem.dbField] && (
                        <svg className="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    {expandedSidebarItem.title}
                  </label>
                  )} 
                  {sidebarItem.type === "oldsearch" && (
                    <div className="relative rounded-md shadow-sm">
                      <div
                        className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
                        onClick={() => handleSearchText(expandedSidebarItem.dbField, searchTexts[expandedSidebarItem.dbField] || '')}
                      >
                        {/*<BiSearch /> */}
                      </div>
                      <input
                        type="text"
                        id={expandedSidebarItemIndex.toString()}
                        value={searchTexts[expandedSidebarItem.dbField] || ''} // Bind input value to state
                        onChange={(e) => onSearchTextChange({ ...searchTexts, [expandedSidebarItem.dbField]: e.target.value })} // Update state on change
                        placeholder="Search"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearchText(expandedSidebarItem.dbField, e.currentTarget.value);
                            e.currentTarget.blur(); // remove focus from the input
                          }
                        }}
                        className="form-input block w-full text-xs py-2 pl-10 pr-8 leading-tight rounded-lg focus:outline-none border-gray-200 focus:border-gray-200 focus:ring-1 focus:ring-gray-200"
                      />
                      <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => clearInput(expandedSidebarItem.dbField)} // Clear input for specific field
                      >
                        <GrFormClose />
                      </div>
                    </div>
                  )} 
                  {sidebarItem.type === "range" && (
                    <div className="flex items-center space-x-2 w-full">
                      <div className="flex items-center flex-1">
                        <CustomCheckbox
                          id={expandedSidebarItemIndex.toString()}
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
                          className="form-input text-xs py-2 pl-4 w-20 rounded-lg border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                        />
                        <span>-</span> {/* Dash */}
                        {/* Max Input */}
                        <input
                          type="text"
                          id={`max-${expandedSidebarItem.dbField}`}
                          value={localRangeValues[expandedSidebarItem.dbField]?.max || ''}
                          onChange={(e) => handleRangeInputChange(expandedSidebarItem.dbField, 'max', e.target.value)}
                          aria-label={`Maximum ${expandedSidebarItem.dbField}`}
                          className="form-input text-xs py-2 pl-4 w-20 rounded-lg border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarPanel;
