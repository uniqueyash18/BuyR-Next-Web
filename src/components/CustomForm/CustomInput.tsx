"use client";

import React from 'react';
import { Field as FormField } from './types';

interface CustomInputProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  field,
  value,
  onChange,
  error
}) => {
  return (
    <div>
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
      </label>
      {field.subHeading && (
        <p className="text-sm text-gray-500 mb-2">{field.subHeading}</p>
      )}
      <input
        type={field.type === 'numeric' ? 'number' : field.type}
        id={field.name}
        name={field.name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={field.disabled}
        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
        className="w-full px-4 py-2 border text-black placeholder:text-gray-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CustomInput; 