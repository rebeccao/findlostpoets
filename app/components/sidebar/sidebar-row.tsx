import React, { useState } from 'react';
import SidebarRowSearch from '~/components/sidebar/sidebar-row-search';
import type { SidebarItem, SubNavItem } from '~/components/sidebar/sidebar-data';
import type { SearchCriteria } from '~/routes/_index';

type SidebarRowProps = {
  item: SidebarItem;
  onTermSelect: (term: SearchCriteria) => void;  
}

const SidebarRow: React.FC<SidebarRowProps> = ({ item, onTermSelect }) => {
  //console.log('SidebarRow: received onTermSelect', item);

  const [subnav, setSubnav] = useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(null); // state to store selected checkbox

  const showSubnav = () => {
    console.log('SidebarRow: showSubnav');
    setSubnav(!subnav);
  };

  const handleTermSelect = (criteria: SearchCriteria) => {
    console.log('SidebarRow: invoking onTermSelect with term:', criteria);
    onTermSelect(criteria); // Call the callback passed from the parent to handle the selected term
  };

  const handleCheckboxChange = (subNavItem: SubNavItem) => {
    if (subNavItem.title && subNavItem.value && selectedCheckbox !== subNavItem.title) {
      setSelectedCheckbox(subNavItem.title);
      handleTermSelect({ [subNavItem.name]: subNavItem.value }); 
    }
  };

  return (
    <>
      <div
        onClick={showSubnav}
        className="flex justify-between items-center px-1 py-1 list-none h-15 text-lg text-link-blue cursor-pointer hover:bg-sidebar-hover-bg hover:border-l-4 hover:border-sidebar-hover-border"
      >
        <div className="flex items-center">
          <span className="ml-4">{item.title}</span>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </div>
        {subnav && item.subNav.map((subItem, index) => (
          <div
            key={index}
            className="flex items-center p-2 pl-8 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            {subItem.type === 'checkbox' ? (
              <label className="w-full flex items-center cursor-pointer" htmlFor={index.toString()}>
                <input
                  id={index.toString()}
                  type="checkbox"
                  name={subItem.name}
                  value={subItem.value}
                  checked={selectedCheckbox === subItem.title}
                  onChange={() => handleCheckboxChange(subItem)}
                  className="appearance-none w-4 h-4 border border-gray-200 rounded-sm shadow-sm bg-white mr-2"
                />
                {subItem.title}
              </label>
            ) : subItem.type === 'search' ? (
              <SidebarRowSearch 
                handleTermSelect={handleTermSelect} 
                searchItem={subItem.name} 
                index={index} />
            ) : (
              <div className="flex flex-col items-start">
                <label htmlFor={index.toString()} className="mb-1">{subItem.title}</label>
                <input
                  id={index.toString()}
                  type="range"
                  {/* min={subItem.min}
                  max={subItem.max}
                  step={subItem.step}  
                  className="..."  */}
                />
                <span className="text-sm mt-1">Value: {/* Dynamic value display logic */}</span>
              </div>
            )}
          </div>
        ))}
    </>
  );
};

export default SidebarRow;
