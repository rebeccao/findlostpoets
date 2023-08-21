import React, { useState } from 'react';
import SidebarRowSearch from '~/components/sidebar/sidebar-row-search';

const SidebarRow = ({ item, onTermSelect }) => {
  //console.log('SidebarRow: received onTermSelect', item);

  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => {
    console.log('SidebarRow: showSubnav');
    setSubnav(!subnav);
  };

  const handleTermSelect = (criteria) => {
    console.log('SidebarRow: invoking onTermSelect with term:', criteria);
    onTermSelect(criteria); // Call the callback passed from the parent to handle the selected term
  };

  return (
    <>
      <div
        onClick={() => {
          item.subNav ? showSubnav() : handleTermSelect(item.searchTerm);
        }}
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
        {subnav &&
         item.subNav.map((subItem, index) => (
          <div
            key={index}
            onClick={() => subItem.type === 'checkbox' && handleTermSelect({ [item.searchTerm]: subItem.title })}
            className="flex items-center p-2 pl-8 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            {subItem.type === 'checkbox' ? (
              <label className="w-full flex items-center">
                <input
                  id={index.toString()}
                  type="checkbox"
                  name={item.title}
                  value={subItem.title}
                  className="..."
                />
                <span className="...">{subItem.title}</span>
              </label>
            ) : subItem.type === 'search' ? (
              <SidebarRowSearch 
                handleTermSelect={handleTermSelect} 
                searchTerm={item.searchTerm} 
                index={index} />
            ) : (
              <div className="flex flex-col items-start">
                <label htmlFor={index.toString()} className="mb-1">{subItem.title}</label>
                <input
                  id={index.toString()}
                  type="range"
                  min={subItem.min}
                  max={subItem.max}
                  step={subItem.step}
                  className="..."
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
