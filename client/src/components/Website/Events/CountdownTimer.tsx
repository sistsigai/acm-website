import React, { useState, useEffect, useRef } from "react";

const calculateInitialTimeLeft = (targetDate: Date) => {
  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;

  if (distance < 0) return null;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return `${days.toString().padStart(2, "0")}d ${hours.toString().padStart(2, "0")}h ${minutes
    .toString()
    .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
};

export const CountdownTimer: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(() => calculateInitialTimeLeft(targetDate));
  const [isClosed, setIsClosed] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setHasMounted(true);
    const initialCheck = calculateInitialTimeLeft(targetDate);
    if (initialCheck === null) {
      setIsClosed(true);
      return;
    }

    setTimeLeft(initialCheck);

    intervalRef.current = window.setInterval(() => {
      const result = calculateInitialTimeLeft(targetDate);
      if (result === null) {
        setIsClosed(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } else {
        setTimeLeft(result);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetDate]);

  if (!hasMounted) {
    return (
      <div className="countdown-container">
        <span className="countdown-label">Registration closes in</span>
        <span className="countdown-timer">Loading...</span>
      </div>
    );
  }

  return (
    <div className="countdown-container">
      {isClosed ? (
        <span className="countdown-closed">Registration Closed</span>
      ) : (
        <>
          <span className="countdown-label">Registration closes in</span>
          <span className="countdown-timer">{timeLeft}</span>
        </>
      )}
    </div>
  );
};

export default CountdownTimer;
