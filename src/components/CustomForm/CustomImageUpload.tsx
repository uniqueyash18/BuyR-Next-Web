"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Field as FormField } from './types';

interface CustomImageUploadProps {
  field: FormField;
  value: string;
  onChange: (value: string, fileName?: string) => void;
  error?: string;
  isUploading?: boolean;
}

const CustomImageUpload: React.FC<CustomImageUploadProps> = ({
  field,
  value,
  onChange,
  error,
  isUploading = false
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Set preview URL when value changes
  useEffect(() => {
    if (value) {
      setPreviewUrl(value);
    }
  }, [value]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert('Please select an image first');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert('Image must be below 4MB');
      return;
    }

    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      alert('Image must be in jpg/png format');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setPreviewUrl(dataUrl);
      // Pass the file name to the parent component
      onChange(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onChange('');
  };

  return (
    <div>
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
      </label>
      {field.subHeading && (
        <p className="text-sm text-gray-500 mb-2">{field.subHeading}</p>
      )}
      <div className="flex items-center space-x-4">
        <input
          type="file"
          id={field.name}
          name={field.name}
          accept="image/jpeg,image/png"
          onChange={handleImageUpload}
          disabled={field.disabled || isUploading}
          className="hidden"
        />
        <label
          htmlFor={field.name}
          className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors
            ${field.disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? 'Uploading...' : 'Choose File'}
        </label>
        {(value || previewUrl) && (
          <div className="relative w-20 h-20 group">
            <Image
              src={previewUrl || value || ''}
              alt="Uploaded Image"
              fill
              className="object-contain rounded-md"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CustomImageUpload; 