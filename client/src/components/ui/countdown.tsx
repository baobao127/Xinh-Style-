import { useState, useEffect } from 'react';
import { calculateTimeRemaining, formatTimeUnit } from '@/lib/utils';

interface CountdownProps {
  endTime: Date;
}

interface TimeRemainingType {
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ endTime }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemainingType>({ hours: 0, minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = calculateTimeRemaining(endTime);
      setTimeRemaining(remaining);
      
      // Stop countdown when it reaches zero
      if (remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
        setIsActive(false);
      }
    };

    // Initial calculation
    updateTimer();

    // Set up interval only if countdown is active
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(updateTimer, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [endTime, isActive]);

  // Format the time units
  const hours = formatTimeUnit(timeRemaining.hours);
  const minutes = formatTimeUnit(timeRemaining.minutes);
  const seconds = formatTimeUnit(timeRemaining.seconds);

  // Split each digit for separate display
  const [hour1, hour2] = hours.split('');
  const [min1, min2] = minutes.split('');
  const [sec1, sec2] = seconds.split('');

  return (
    <div className="flex space-x-1">
      <div className="bg-white text-primary w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded timer-block font-bold text-sm md:text-base">{hour1}</div>
      <div className="bg-white text-primary w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded timer-block font-bold text-sm md:text-base">{hour2}</div>
      <span className="text-white text-lg font-bold">:</span>
      <div className="bg-white text-primary w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded timer-block font-bold text-sm md:text-base">{min1}</div>
      <div className="bg-white text-primary w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded timer-block font-bold text-sm md:text-base">{min2}</div>
      <span className="text-white text-lg font-bold">:</span>
      <div className="bg-white text-primary w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded timer-block font-bold text-sm md:text-base">{sec1}</div>
      <div className="bg-white text-primary w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded timer-block font-bold text-sm md:text-base">{sec2}</div>
    </div>
  );
};

export default Countdown;
