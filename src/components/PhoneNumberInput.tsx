"use client";

import React from 'react';

interface PhoneNumberInputProps {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  containerStyles?: string;
  maxLength?: number;
  countryCode?: string;
  countryFlag?: string;
  setCountryCode?: (code: string) => void;
  setCountryFlag?: (flag: string) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  placeholder,
  onChangeText,
  containerStyles = '',
  maxLength,
  countryCode = '+91',
  countryFlag = '🇮🇳',
  setCountryCode,
  setCountryFlag,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters
    const numericValue = e.target.value.replace(/\D/g, '');
    onChangeText(numericValue);
  };

  return (
    <div className={`relative ${containerStyles}`}>
      <div className="flex">
        <div className="flex items-center rounded-l-md border border-r-0 border-gray-300 bg-white px-3 py-2 text-gray-500">
          <span className="mr-1"> {countryCode}</span>
        </div>
        <input
          type="tel"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          maxLength={maxLength}
          pattern="[0-9]*"
          style={{
            width: "100%"
          }}

          inputMode="numeric"
          className="flex-1 rounded-r-md border border-gray-300 py-2 px-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-black placeholder:text-gray-500"
        />
      </div>
    </div>
  );
};

export default PhoneNumberInput; 