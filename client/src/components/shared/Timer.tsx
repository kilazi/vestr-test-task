import React, { useState, useEffect } from 'react';
import './Timer.css';

interface TimerProps {
  startTime?: number; // seconds
  onTimeUpdate?: (seconds: number) => void;
}

const Timer: React.FC<TimerProps> = ({ startTime = 0, onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(startTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const newSeconds = prev + 1;
        if (onTimeUpdate) {
          onTimeUpdate(newSeconds);
        }
        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUpdate]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="timer">
      {minutes} mins {remainingSeconds} seconds
    </div>
  );
};

export default Timer;

