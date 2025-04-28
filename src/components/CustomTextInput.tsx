"use client";

import React from 'react';
import Image from 'next/image';

interface CustomTextInputProps {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  isLeft?: boolean;
  leftImg?: string;
  rightImg?: string;
  onPressRight?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: string;
  containerStyles?: string;
  rightImageStyle?: string;
  maxLength?: number;
  autoCapitalize?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  value,
  placeholder,
  onChangeText,
  isLeft = false,
  leftImg,
  rightImg,
  onPressRight,
  secureTextEntry = false,
  keyboardType = 'text',
  containerStyles = '',
  rightImageStyle = '',
  maxLength,
  autoCapitalize,
}) => {
  return (
    <div className={`relative flex items-center ${containerStyles}`}>
      {isLeft && leftImg && (
        <div className="absolute left-3 flex items-center justify-center">
          <Image src={leftImg} alt="left icon" width={20} height={20} />
        </div>
      )}
      <input
        type={secureTextEntry ? 'password' : keyboardType === 'email-address' ? 'email' : 'text'}
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        className={`w-full rounded-md border border-gray-300 py-2 px-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
          isLeft ? 'pl-10' : ''
        } ${rightImg ? 'pr-10' : ''}`}
      />
      {rightImg && (
        <button
          type="button"
          onClick={onPressRight}
          className="absolute right-3 flex items-center justify-center"
        >
          <Image src={rightImg} alt="right icon" width={20} height={20} className={rightImageStyle} />
        </button>
      )}
    </div>
  );
};

export default CustomTextInput; 