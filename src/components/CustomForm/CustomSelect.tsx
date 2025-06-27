"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Field as FormField } from './types';
import { isEmpty } from 'lodash';

interface CustomSelectProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string | any[];
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

  // Ensure value is always an array for multiselect
  const selectedValues = isMulti ? (Array.isArray(value) ? value : []) : value;

  // Get error for a specific item's custom field
  const getCustomFieldError = (index: number, fieldName: string) => {
    if (!error || !Array.isArray(error)) return undefined;
    const itemError = error[index];
    return itemError?.[fieldName];
  };

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
      const currentValue = selectedValues;
      const optionExists = currentValue.some((item: any) => item.id === optionId);
      
      let newValue;
      if (optionExists) {
        // Remove the option if it's already selected
        newValue = currentValue.filter((item: any) => item.id !== optionId);
      } else {
        // Add the option if it's not selected
        const optionToAdd = field.options?.find(opt => opt.id === optionId);
        if (optionToAdd) {
          newValue = [...currentValue, { ...optionToAdd, customPrice: '', customDeliveryFee: '' }];
        }
      }
      
      onChange(newValue);
    } else {
      const selectedOption = field.options?.find(opt => opt.id === optionId);
      onChange(selectedOption);
      setIsOpen(false);
    }
  };

  const handleCustomFieldChange = (optionId: string, fieldName: string, fieldValue: string) => {
    if (!isMulti) return;
    
    const currentValue = selectedValues;
    const newValue = currentValue.map((item: any) => {
      if (item.id === optionId) {
        return { ...item, [fieldName]: fieldValue };
      }
      return item;
    });
    
    onChange(newValue);
  };

  const handleRemoveSelected = (optionId: string) => {
    if (!isMulti) return;
    
    const currentValue = selectedValues;
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
    if (!value) return field.placeholder || 'Select an option';
    if (isMulti) {
      if (selectedValues.length === 0) return field.placeholder || 'Select options';
      return `${selectedValues.length} items selected`;
    }
    return value.label;
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
        <div ref={dropdownRef} className="relative">
          <div className="space-y-2">
            {selectedValues.map((item: any, index: number) => (
              <div key={item.id} className="border border-gray-300 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSelected(item.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                {field.customFields?.map((customField) => (
                  <div key={customField.name} className="mt-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      {customField.label}
                    </label>
                    <input
                      type={customField.type === 'numeric' ? 'number' : 'text'}
                      value={item[customField.name] || ''}
                      onChange={(e) => handleCustomFieldChange(item.id, customField.name, e.target.value)}
                      placeholder={customField.placeholder}
                      className={`w-full px-3 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        getCustomFieldError(index, customField.name) ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {getCustomFieldError(index, customField.name) && (
                      <p className="text-red-500 text-sm mt-1">{getCustomFieldError(index, customField.name)}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleDropdown}
            disabled={field.disabled}
            className="mt-2 w-full px-4 py-2 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              disabled:bg-gray-100 disabled:cursor-not-allowed flex justify-between items-center text-gray-500"
          >
            <span className="truncate">Add more products</span>
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
                {field.options?.map((option) => {
                  const isSelected = selectedValues.some((item: any) => item.id === option.id);
                  return (
                    <li
                      key={option.id}
                      className={`px-4 py-2 cursor-pointer text-black ${isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                      onClick={() => handleChange(option.id)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {option.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
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
      {!Array.isArray(error) && error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CustomSelect; 