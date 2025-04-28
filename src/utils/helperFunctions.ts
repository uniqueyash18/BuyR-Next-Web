"use client";

import { postData } from "@/services/apiService";

// For web, we'll use a simple toast notification system
// In a real implementation, you might want to use a library like react-toastify

let toastContainer: HTMLDivElement | null = null;

const createToastContainer = () => {
  if (typeof document === 'undefined') return null;
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(toastContainer);
  }
  
  return toastContainer;
};

const showToast = (message: string, type: 'success' | 'error') => {
  if (typeof document === 'undefined') return;
  
  const container = createToastContainer();
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `p-4 rounded-md shadow-md ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 3000);
};

export const showSuccess = (message: string) => {
  showToast(message, 'success');
};

export const showError = (message: string) => {
  showToast(message, 'error');
}; 

export const uploadImage = async (
  image: {uri: string; name: string; type: string},
  dealId?: string,
) => {
  if (!image) {
    showError('Please select an image first');
    return;
  }

  const formData = new FormData();
  
  // For web, we need to convert the data URL to a Blob
  try {
    // If image.uri is a data URL, convert it to a Blob
    let blob;
    if (image.uri.startsWith('data:')) {
      const response = await fetch(image.uri);
      blob = await response.blob();
    } else {
      // If it's a file path or URL, fetch it first
      const response = await fetch(image.uri);
      blob = await response.blob();
    }
    
    formData.append('file', blob, image.name);
    
    if (dealId) {
      formData.append('dealId', dealId); // Add other fields if needed
    }
    
    const response = await postData(
      '/fileUpload',
      formData,
      {'Content-Type': 'multipart/form-data'},
    );
    
    if (response?.statusCode === 200) {
      return response;
    } else {
      return response?.data?.message;
    }
  } catch (error:any) {
    console.error(error,'testerrorerror');
    showError(error?.error||'An error occurred during upload');
  }
};