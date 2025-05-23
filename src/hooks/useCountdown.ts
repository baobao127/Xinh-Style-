import { useEffect, useState } from 'react';

export function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState(target.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(target.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  return Math.max(0, timeLeft);
}