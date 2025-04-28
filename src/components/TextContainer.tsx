"use client";

import React from 'react';

interface TextContainerProps {
  text: string;
  style?: string;
  children?: React.ReactNode;
}

const TextContainer: React.FC<TextContainerProps> = ({ text, style = '', children }) => {
  // In a real implementation, you would use i18n for translations
  // For now, we'll just return the text directly
  return (
    <div className={style}>
      {text}
      {children}
    </div>
  );
};

export default TextContainer; 