"use client";

import React, { useState, useRef, useEffect } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (optionId: string) => {
    if (isMulti) {
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
    } else {
      const selectedOption = field.options?.find(opt => opt.id === optionId);
      onChange(selectedOption);
      setIsOpen(false);
    }
  };

  const handleRemoveSelected = (optionId: string) => {
    if (!isMulti) return;
    
    const currentValue = value || [];
    const newValue = currentValue.filter((item: any) => item.id !== optionId);
    onChange(newValue);
  };

  const toggleDropdown = () => {
    if (!field.disabled) {
      setIsOpen(!isOpen);
      onDropdownOpen?.(!isOpen);
    }
  };

  const getDisplayValue = () => {
    if (isMulti) {
      if (!value || value.length === 0) {
        return field.placeholder || `Select ${field.label.toLowerCase()}`;
      }
      return `${value.length} selected`;
    } else {
      return value?.label || field.placeholder || `Select ${field.label.toLowerCase()}`;
    }
  };

  return (
    <div>
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-500 mb-1">
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
                  <span className="text-black">{item.label}</span>
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
                  className={`px-4 py-2 cursor-pointer text-black ${isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  onClick={() => handleChange(option.id)}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            id={field.name}
            name={field.name}
            onClick={toggleDropdown}
            disabled={field.disabled}
            className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              disabled:bg-gray-100 disabled:cursor-not-allowed flex justify-between items-center text-gray-500"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className="truncate">{getDisplayValue()}</span>
            <svg 
              className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
              <ul className="py-1" role="listbox">
                {field.options?.map((option) => (
                  <li
                    key={option.id}
                    className={`px-4 py-2 cursor-pointer text-black ${value?.id === option.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                    onClick={() => handleChange(option.id)}
                    role="option"
                    aria-selected={value?.id === option.id}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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