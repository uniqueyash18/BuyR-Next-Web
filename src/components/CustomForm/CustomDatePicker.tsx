"use client";

import React from 'react';
import { Field as FormField } from './types';
import dayjs from 'dayjs';

interface CustomDatePickerProps {
  field: FormField;
  value: string | Date;
  onChange: (value: string) => void;
  error?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  field,
  value,
  onChange,
  error
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor={field.name} className="block text-sm font-medium text-black mb-1">
        {field.label}
      </label>
      {field.subHeading && (
        <p className="text-sm text-gray-500 mb-2">{field.subHeading}</p>
      )}
      <input
        type="date"
        id={field.name}
        name={field.name}
        value={typeof value === 'string' ? value : dayjs(value).format('YYYY-MM-DD')}
        onChange={handleChange}
        max={field.maxDate ? dayjs(field.maxDate).format('YYYY-MM-DD') : undefined}
        min={field.minDate ? dayjs(field.minDate).format('YYYY-MM-DD') : undefined}
        disabled={field.disabled}
        className="w-full px-4 py-2 border text-black placeholder:text-gray-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CustomDatePicker; 