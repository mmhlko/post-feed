import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | Date, type?: 'birth' | 'full') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (type === 'birth') {
    // возвращаем только yyyy-MM-dd
    return dateObj.toISOString().split('T')[0];
  }

  // по умолчанию форматируем с датой и временем
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