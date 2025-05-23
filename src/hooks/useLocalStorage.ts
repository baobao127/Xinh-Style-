import { useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const ls = localStorage.getItem(key);
    return ls ? JSON.parse(ls) : initial;
  });

  const setLS = (val: T) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  return [value, setLS] as const;
}