"use client";

import { useEffect, useState } from "react";

export const useCountdown = (targetDate: Date | null) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(0);
      setIsExpired(true);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(targetDate).getTime();
      const diff = start - now;
      return Math.max(0, diff);
    };

    //calculate intial differen
    const intialDiff = calculateTimeLeft();
    setTimeLeft(intialDiff);
    setIsExpired(intialDiff <= 0);

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setIsExpired(true);
        clearInterval(interval);
      } else {
        setIsExpired(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor((ms - 400) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isExpired,
  };
};
