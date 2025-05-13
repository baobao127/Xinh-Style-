import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
  if (!originalPrice || !salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInMillis = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMillis / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} ngày trước`;
  } else if (diffInHours > 0) {
    return `${diffInHours} giờ trước`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} phút trước`;
  } else {
    return 'Vừa xong';
  }
}

export function calculateTimeRemaining(endTime: Date): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const diffInMillis = endTime.getTime() - now.getTime();
  
  // If end time has passed, return all zeros
  if (diffInMillis <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }
  
  const diffInSeconds = Math.floor(diffInMillis / 1000);
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;
  
  return { hours, minutes, seconds };
}

export function formatTimeUnit(value: number): string {
  return value.toString().padStart(2, '0');
}

export function getRandomItemsFromArray<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateStarRating(rating: number): { full: number; half: number; empty: number } {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return { full, half, empty };
}

// Network connection utilities
export function isOnline(): boolean {
  return navigator.onLine;
}

// Image lazy loading optimization
export const lazyLoadImage = (imageUrl: string, placeholderUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => resolve(imageUrl);
    img.onerror = () => resolve(placeholderUrl);
  });
};

// Debounce function to limit API requests especially on mobile
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Retry failed network requests
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let retries = 0;
  
  const execute = async (): Promise<T> => {
    try {
      return await requestFn();
    } catch (error) {
      if (retries >= maxRetries) throw error;
      
      retries++;
      await new Promise(resolve => setTimeout(resolve, delay * retries));
      return execute();
    }
  };
  
  return execute();
}
