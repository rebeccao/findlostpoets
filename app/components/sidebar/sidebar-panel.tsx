import { sidebarItems } from "~/components/sidebar/sidebar-data";
import type { SearchCriteria } from "~/routes/_index";
import React, { useState } from "react";
import { BiSearch, BiSolidChevronDown, BiSolidChevronUp } from "react-icons/bi";
import { GrFormClose } from "react-icons/gr";
import type { SidebarItemExpanded } from "~/components/sidebar/sidebar-data";

interface SidebarPanelProps {
  onSelectionChange: (dbQuery: SearchCriteria) => void;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ onSelectionChange }) => {
  console.log("SidebarPanel start");

  const [expandedRowId, setExpandedRowId] = useState<string | null>(null); // State to store the title of the currently expanded row, null if none
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<Record<string, boolean>>({});
  const [searchTexts, setSearchTexts] = useState<Record<string, string>>({});

  const expandCollapseRow = (sidebarItemTitle: string) => {
    if (expandedRowId === sidebarItemTitle) {
      setExpandedRowId(null); // If clicking the currently expanded row, collapse it
    } else {
      setExpandedRowId(sidebarItemTitle); // Otherwise, expand the clicked row
    }
  };

  // Checkbox search. Selecting and unselecting checkbox trigger DB search
  const handleCheckboxChange = (dbField: string, isChecked: boolean) => {
    const updatedSelections = { ...selectedCheckboxes, [dbField]: isChecked };

    // Update the selected checkboxes state
    setSelectedCheckboxes(updatedSelections);

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
    }
  };

  // Text Search: Magnifying glass and <return> onClick handlers to trigger DB search
  const handleSearchText = (dbField: string, value: string) => {
    // Update the searchTexts state with the new value, but only if it's not empty or whitespace
    if (value.trim().length > 0 || dbField === '') {
      const trimmedValue = value.trim();
      const newSearchTexts = { ...searchTexts, [dbField]: trimmedValue };
      setSearchTexts(newSearchTexts);
  
      // Explicitly type the accumulator in the reduce function
      /*const whereConditions = Object.entries(newSearchTexts).reduce<{ [key: string]: { equals: string; mode: 'insensitive' } }[]>((acc, [key, value]) => {
        if (value.trim()) {
          acc.push({ [key]: { equals: value, mode: "insensitive" } });
        }
        return acc;
      }, []);  */
      
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
    setSearchTexts(newSearchTexts);
  
    // Trigger a default search if all text inputs are cleared
    // Check if searchTexts is empty to decide whether to revert to default search
    if (Object.keys(newSearchTexts).length === 0) {
      onSelectionChange({ orderBy: { pid: 'asc' } });
    } else {
      // If other search texts exist, trigger search with remaining conditions
      handleSearchText('', '');
    }
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
    console.log("SidebarPanel: Range onSelectionChange:", searchCriteria);
    //onSelectionChange(dbQuery, urlSegment); // Call the callback passed from the parent
  };

  return (
    <div> 
      {sidebarItems.map((sidebarItem, index) => {
        //console.log("SidebarRow: received row item", sidebarItem);
        // Determine if the current sidebar item is expanded
        const rowExpanded = expandedRowId === sidebarItem.title;

        return (
          <React.Fragment key={sidebarItem.title}>
            <div
              onClick={() => expandCollapseRow(sidebarItem.title)} // Pass the sidebarItem's title to expand or collapse
              className="flex justify-between items-center px-1 py-1 list-none h-15 text-md sans font-medium text-link-blue cursor-pointer hover:bg-sidebar-hover-bg hover:border-l-4 hover:border-sidebar-hover-border"
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
                    {sidebarItem.type === "checkbox" && (
                      <label className="w-full flex items-center cursor-pointer" htmlFor={index.toString()}>
                      <input
                        id={index.toString()}
                        type="checkbox"
                        value={expandedSidebarItem.dbField}
                        checked={selectedCheckboxes[expandedSidebarItem.dbField] ?? false} 
                        onChange={(e) => handleCheckboxChange(expandedSidebarItem.dbField, e.target.checked)}
                        className="opacity-0 absolute h-4 w-4"
                      />
                      <span className={`ml-1 w-4 h-4 rounded-sm shadow-sm flex justify-center items-center mr-2 ${selectedCheckboxes[expandedSidebarItem.dbField] ? 'bg-gray-400 border-gray-700' : 'bg-white border border-gray-200'}`}>
                        {selectedCheckboxes[expandedSidebarItem.dbField] && (
                          <svg className="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      {expandedSidebarItem.title}
                    </label>
                    )} 
                    {sidebarItem.type === "search" && (
                      <div className="relative rounded-md shadow-sm">
                        <div
                          className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
                          onClick={() => handleSearchText(expandedSidebarItem.dbField, searchTexts[expandedSidebarItem.dbField] || '')}
                        >
                          <BiSearch />
                        </div>
                        <input
                          type="text"
                          id={index.toString()}
                          value={searchTexts[expandedSidebarItem.dbField] || ''} // Bind input value to state
                          onChange={(e) => setSearchTexts({ ...searchTexts, [expandedSidebarItem.dbField]: e.target.value })} // Update state on change
                          placeholder="Search"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSearchText(expandedSidebarItem.dbField, e.currentTarget.value);
                              e.currentTarget.blur(); // remove focus from the input
                            }
                          }}
                          className="form-input block w-full text-xs py-1 pl-10 pr-8 leading-tight rounded-lg focus:outline-none border-gray-200 focus:border-gray-200 focus:ring-1 focus:ring-gray-200"
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
