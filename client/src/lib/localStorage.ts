import { STORAGE_KEYS } from "./constants";

// Check if localStorage is available
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn("localStorage is not available:", error);
    return false;
  }
}

// Generic function to get data from localStorage with fallback
export function getStorageData<T>(key: string, defaultValue: T): T {
  if (!isLocalStorageAvailable()) return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting localStorage item ${key}:`, error);
    return defaultValue;
  }
}

// Generic function to set data in localStorage with fallback
export function setStorageData<T>(key: string, value: T): void {
  if (!isLocalStorageAvailable()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error);
  }
}

// New: Save temporary products
export function saveTemporaryProduct(product: any): void {
  setStorageData(STORAGE_KEYS.tempProduct, product);
}

// New: Get temporary product
export function getTemporaryProduct(): any | null {
  return getStorageData(STORAGE_KEYS.tempProduct, null);
}

// Other existing functions (e.g., getCart, setCart) remain unchanged