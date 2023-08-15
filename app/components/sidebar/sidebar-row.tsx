import React, { useState } from 'react';

const SidebarRow = ({ item, onTermSelect }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);
  const handleTermSelect = (term) => {
    onTermSelect(term); // Call the callback passed from the parent to handle the selected term
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
            onClick={() => handleTermSelect(subItem.searchTerm)}
            className="flex items-center p-2 pl-9 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <label className="w-full flex items-center">
              <input 
                id={index.toString()}
                type="checkbox" 
                name={item.title} 
                value={subItem.title} 
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounde dark:bg-gray-600 dark:border-gray-500"
              />
              <span
                className="w-full ml-2 text-md font-medium text-gray-900 rounded dark:text-gray-300"
              >
                {subItem.title}
              </span>
            </label>
          </div>
        ))}
    </>
  );
};

export default SidebarRow;
