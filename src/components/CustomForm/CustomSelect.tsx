"use client";

import React from 'react';
import { Field as FormField } from './types';
import { isEmpty } from 'lodash';

interface CustomSelectProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  onDropdownOpen?: (isOpen: boolean) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  field,
  value,
  onChange,
  error,
  onDropdownOpen
}) => {
  const isMulti = field.type === 'multiselect';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isMulti) {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => {
        return field.options?.find(opt => opt.id === option.value);
      });
      onChange(selectedOptions);
    } else {
      const selectedOption = field.options?.find(opt => opt.id === e.target.value);
      onChange(selectedOption);
    }
  };

  const handleOptionClick = (optionId: string) => {
    if (!isMulti) return;
    
    const currentValue = value || [];
    const optionExists = currentValue.some((item: any) => item.id === optionId);
    
    let newValue;
    if (optionExists) {
      // Remove the option if it's already selected
      newValue = currentValue.filter((item: any) => item.id !== optionId);
    } else {
      // Add the option if it's not selected
      const optionToAdd = field.options?.find(opt => opt.id === optionId);
      if (optionToAdd) {
        newValue = [...currentValue, optionToAdd];
      }
    }
    
    onChange(newValue);
  };

  const handleRemoveSelected = (optionId: string) => {
    if (!isMulti) return;
    
    const currentValue = value || [];
    const newValue = currentValue.filter((item: any) => item.id !== optionId);
    onChange(newValue);
  };

  return (
    <div>
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
      </label>
      {field.subHeading && (
        <p className="text-sm text-gray-500 mb-2">{field.subHeading}</p>
      )}
      {isMulti ? (
        <div>
          {/* Selected items summary */}
          {value && value.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {value.map((item: any) => (
                <div 
                  key={item.id} 
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center"
                >
                  <span>{item.label}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSelected(item.id)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Options list */}
          <div 
            className="w-full border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 
              disabled:bg-gray-100 disabled:cursor-not-allowed overflow-y-auto"
            style={{ minHeight: '120px', maxHeight: '200px' }}
            onFocus={() => onDropdownOpen?.(true)}
            onBlur={() => onDropdownOpen?.(false)}
          >
            {field.options?.map((option) => {
              const isSelected = (value || []).some((item: any) => item.id === option.id);
              return (
                <div 
                  key={option.id}
                  className={`px-4 py-2 cursor-pointer ${isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  onClick={() => handleOptionClick(option.id)}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <select
          id={field.name}
          name={field.name}
          value={value?.id || ''}
          onChange={handleChange}
          onFocus={() => onDropdownOpen?.(true)}
          onBlur={() => onDropdownOpen?.(false)}
          disabled={field.disabled}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="" disabled>
            {field.placeholder || `Select ${field.label.toLowerCase()}`}
          </option>
          {field.options?.map((option) => (
            <option 
              key={option.id} 
              value={option.id}
              className="py-2"
            >
              {option.label}
            </option>
          ))}
        </select>
      )}
      {isMulti && (
        <p className="text-sm text-gray-500 mt-1">Click to select/deselect items</p>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CustomSelect; 