import { useState, useEffect, useRef } from "react";

const Timer = () => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="timer card">
      <h2>Dragon Timer</h2>
      <div className="timer-display">{formatTime(secondsLeft)}</div>
      <button onClick={toggleTimer} className="timer-button">
        {isRunning ? "Pause" : "Start"}
      </button>
    </div>
  );
};

export default Timer;
