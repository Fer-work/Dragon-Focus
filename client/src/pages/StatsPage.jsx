import { useState, useEffect } from "react";
import "../styles/index.css";

export default function StatsPage() {
  // Dummy data for now - later you fetch this from backend
  const [todayStats, setTodayStats] = useState({
    sessionsCompleted: 0,
    minutesWorked: 0,
    tasks: [],
  });

  useEffect(() => {
    // Here you would fetch from API
    // For now let's fake some data
    const fakeData = {
      sessionsCompleted: 5,
      minutesWorked: 125,
      tasks: [
        { project: "Dragon Focus", task: "Timer Component", minutes: 60 },
        { project: "Dragon Focus", task: "Stats Page", minutes: 65 },
      ],
    };

    setTodayStats(fakeData);
  }, []);

  return (
    <div className="stats">
      <h2 className="stats-title">📈 Today's Stats</h2>

      <div className="stats-summary">
        <p>
          <strong>Sessions Completed:</strong> {todayStats.sessionsCompleted}
        </p>
        <p>
          <strong>Total Minutes Worked:</strong> {todayStats.minutesWorked} min
        </p>
      </div>

      <div className="stats-tasks">
        <h3>Task Breakdown:</h3>
        <ul>
          {todayStats.tasks.map((task, index) => (
            <li key={index}>
              <strong>Project:</strong> {task.project} — <strong>Task:</strong>{" "}
              {task.task} — <strong>Minutes:</strong> {task.minutes}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export async function statsLoader({ params }) {
  const response = await axios.get("/stats" + params.name);
  return response;
}
