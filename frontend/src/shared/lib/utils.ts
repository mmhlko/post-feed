import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | Date | null | undefined, type?: 'birth' | 'full') => {
  // Handle null/undefined values
  if (!date) {
    return '';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  if (type === 'birth') {
    // return only yyyy-MM-dd
    return dateObj.toISOString().split('T')[0];
  }

  // default format
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};