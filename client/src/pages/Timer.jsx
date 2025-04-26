import { useState, useEffect, useRef } from "react";
import "../styles/index.css";

const sessionOptions = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const Timer = () => {
  const [secondsLeft, setSecondsLeft] = useState(sessionOptions.work);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState("work");
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

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setSecondsLeft(sessionOptions[currentSession]);
    setIsRunning(false);
  };

  const changeSession = (sessionType) => {
    clearInterval(intervalRef.current);
    setCurrentSession(sessionType);
    setSecondsLeft(sessionOptions[sessionType]);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="timer">
      <h2 className="timer-title">🔥 Dragon Timer 🔥</h2>

      <div className="session-buttons">
        <button
          onClick={() => changeSession("work")}
          className={`session-button ${
            currentSession === "work" ? "active" : ""
          }`}
        >
          Work
        </button>
        <button
          onClick={() => changeSession("shortBreak")}
          className={`session-button ${
            currentSession === "shortBreak" ? "active" : ""
          }`}
        >
          Short Break
        </button>
        <button
          onClick={() => changeSession("longBreak")}
          className={`session-button ${
            currentSession === "longBreak" ? "active" : ""
          }`}
        >
          Long Break
        </button>
      </div>

      <div className="timer-display">{formatTime(secondsLeft)}</div>

      <div className="timer-buttons">
        <button onClick={toggleTimer} className="timer-button">
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={resetTimer} className="timer-button secondary">
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
