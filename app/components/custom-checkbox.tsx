// custom-checkbox.tsx
import React from 'react';

interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ id, checked, onChange, label }) => {
  return (
    <div className="flex items-center flex-1">
      {/* Actual Checkbox (hidden) */}
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="opacity-0 absolute h-4 w-4"
        aria-hidden="true"
      />
      {/* Custom Checkbox UI */}
      <label htmlFor={id} className="flex items-center cursor-pointer text-gainsboro">
        <div className={`w-4 h-4 rounded shadow-sm flex justify-center items-center mr-2 border ${checked ? 'bg-charcoalgray border-darkgray2' : 'bg-davysgray border border-naughtygray'}`}>
          {checked && (
            <svg className="w-3 h-3 text-pearlwhite" viewBox="0 0 20 20" fill="currentColor">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
            </svg>
          )}
        </div>
        {label}
      </label>
    </div>
  );
};

export default CustomCheckbox;