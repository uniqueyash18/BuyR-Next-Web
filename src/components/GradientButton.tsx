"use client";

import React from 'react';

interface GradientButtonProps {
  onPress?: () => void;
  onClick?: () => void;
  btnText?: string;
  indicator?: boolean;
  containerStyle?: string;
  className?: string;
  variant?: 'primary' | 'outline';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  onPress,
  onClick,
  btnText,
  indicator = false,
  containerStyle = '',
  className = '',
  variant = 'primary',
  fullWidth = false,
  children,
}) => {
  const handleClick = onPress || onClick;
  
  const getVariantClasses = () => {
    if (variant === 'primary') {
      return 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white';
    } else if (variant === 'outline') {
      return 'bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50';
    }
    return 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white';
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={indicator}
      className={`relative rounded-md py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${getVariantClasses()} ${widthClass} ${containerStyle} ${className}`}
    >
      {indicator ? (
        <div className="flex items-center justify-center">
          <svg
            className="mr-2 h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        children || btnText
      )}
    </button>
  );
};

export default GradientButton; 