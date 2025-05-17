import {
  isToday, // Checks if a date is today
  parseISO, // Parses an ISO date string (like the one from your DB)
  startOfWeek, // Gets the start of a week for a given date
  endOfWeek, // Gets the end of a week
  startOfMonth, // Gets the start of a month
  endOfMonth, // Gets the end of a month
  isWithinInterval, // Checks if a date is within a given interval
} from "date-fns";

/**
 * Filters an array of session objects to include only those that occurred today.
 * @param {Array<Object>} sessions - An array of session objects. Each session must have a 'timestamp' property (ISO string).
 * @returns {Array<Object>} An array of sessions that occurred today.
 */
export const filterSessionsForToday = (sessions) => {
  if (!Array.isArray(sessions)) {
    console.error("filterSessionsForToday: Input is not an array.");
    return [];
  }
  return sessions.filter((session) => {
    if (!session.timestamp) {
      // console.warn("filterSessionsForToday: Session missing timestamp", session);
      return false;
    }
    try {
      const sessionDate = parseISO(session.timestamp);
      return isToday(sessionDate);
    } catch (error) {
      console.error(
        "filterSessionsForToday: Error parsing session timestamp",
        session.timestamp,
        error
      );
      return false;
    }
  });
};

/**
 * Filters an array of session objects for the current week (e.g., Sunday to Saturday, or Monday to Sunday based on locale).
 * @param {Array<Object>} sessions - An array of session objects.
 * @param {Object} [options] - Options for date-fns startOfWeek/endOfWeek (e.g., { weekStartsOn: 1 } for Monday).
 * @returns {Array<Object>} An array of sessions that occurred this week.
 */
export const filterSessionsForThisWeek = (
  sessions,
  options = { weekStartsOn: 0 }
) => {
  // 0 for Sunday, 1 for Monday
  if (!Array.isArray(sessions)) return [];
  const today = new Date();
  const weekStart = startOfWeek(today, options);
  const weekEnd = endOfWeek(today, options);

  return sessions.filter((session) => {
    if (!session.timestamp) return false;
    try {
      const sessionDate = parseISO(session.timestamp);
      return isWithinInterval(sessionDate, { start: weekStart, end: weekEnd });
    } catch (error) {
      console.error(
        "filterSessionsForThisWeek: Error parsing session timestamp",
        session.timestamp,
        error
      );

      return false;
    }
  });
};

/**
 * Filters an array of session objects for the current month.
 * @param {Array<Object>} sessions - An array of session objects.
 * @returns {Array<Object>} An array of sessions that occurred this month.
 */
export const filterSessionsForThisMonth = (sessions) => {
  if (!Array.isArray(sessions)) return [];
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  return sessions.filter((session) => {
    if (!session.timestamp) return false;
    try {
      const sessionDate = parseISO(session.timestamp);
      return isWithinInterval(sessionDate, {
        start: monthStart,
        end: monthEnd,
      });
    } catch (error) {
      console.error(
        "filterSessionsForThisMonth: Error parsing session timestamp",
        session.timestamp,
        error
      );

      return false;
    }
  });
};

/**
 * Calculates the total duration in minutes from an array of session objects.
 * @param {Array<Object>} sessions - An array of session objects. Each session must have a 'duration' property (number).
 * @returns {number} The total duration in minutes.
 */
export const calculateTotalMinutes = (sessions) => {
  if (!Array.isArray(sessions)) {
    console.error("calculateTotalMinutes: Input is not an array.");
    return 0;
  }
  return sessions.reduce((total, session) => {
    if (typeof session.duration !== "number" || isNaN(session.duration)) {
      // console.warn("calculateTotalMinutes: Session with invalid duration", session);
      return total;
    }
    return total + session.duration;
  }, 0);
};

/**
 * Counts the number of sessions in an array.
 * @param {Array<Object>} sessions - An array of session objects.
 * @returns {number} The total number of sessions.
 */
export const countSessions = (sessions) => {
  if (!Array.isArray(sessions)) {
    console.error("countSessions: Input is not an array.");
    return 0;
  }
  return sessions.length;
};

/**
 * Groups sessions by project and calculates total time spent per project.
 * @param {Array<Object>} sessions - An array of session objects. Each session should have a 'projectId' object with 'name' and 'color', and a 'duration'.
 * @returns {Array<Object>} An array of objects, e.g., [{ name: 'Project A', value: 120, color: '#ff0000' }, ...]
 */
export const aggregateTimeByProject = (sessions) => {
  if (!Array.isArray(sessions)) return [];

  const projectTimeMap = new Map();

  sessions.forEach((session) => {
    if (
      session.projectId &&
      typeof session.projectId === "object" &&
      session.projectId.name &&
      typeof session.duration === "number"
    ) {
      const projectName = session.projectId.name;
      const projectColor = session.projectId.color || "#8884d8"; // Default color if none provided

      if (projectTimeMap.has(projectName)) {
        projectTimeMap.set(projectName, {
          value: projectTimeMap.get(projectName).value + session.duration,
          color: projectColor, // Assuming color is consistent for the project
        });
      } else {
        projectTimeMap.set(projectName, {
          value: session.duration,
          color: projectColor,
        });
      }
    }
  });

  // Convert map to array format suitable for Recharts (e.g., PieChart)
  return Array.from(projectTimeMap, ([name, data]) => ({
    name,
    value: data.value,
    fill: data.color,
  }));
};

/**
 * Prepares data for a timeline chart (e.g., focus minutes per day for the last N days).
 * @param {Array<Object>} sessions - An array of session objects.
 * @param {number} numberOfDays - The number of past days to include (e.g., 7 for last week).
 * @returns {Array<Object>} Data formatted for a bar or line chart, e.g., [{ date: 'Mon', minutes: 60 }, ...]
 */
export const prepareTimelineData = (sessions, numberOfDays = 7) => {
  if (!Array.isArray(sessions)) return [];

  const timelineData = [];
  const today = new Date();

  for (let i = numberOfDays - 1; i >= 0; i--) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);
    targetDate.setHours(0, 0, 0, 0); // Normalize to start of the day

    const sessionsForDate = sessions.filter((session) => {
      if (!session.timestamp) return false;
      try {
        const sessionDate = parseISO(session.timestamp);
        sessionDate.setHours(0, 0, 0, 0); // Normalize session date
        return sessionDate.getTime() === targetDate.getTime();
      } catch (error) {
        console.error(
          "filterSessionsForThisMonth: Error parsing session timestamp",
          session.timestamp,
          error
        );
        return false;
      }
    });

    const totalMinutesForDate = calculateTotalMinutes(sessionsForDate);

    timelineData.push({
      // Format date for display (e.g., 'Mon', 'Tue' or 'MM/DD')
      // date: format(targetDate, 'EEE'), // e.g., Mon, Tue
      date: targetDate.toLocaleDateString(undefined, { weekday: "short" }), // 'Mon', 'Tue' (locale-dependent)
      // date: format(targetDate, 'MM/dd'),
      minutes: totalMinutesForDate,
    });
  }
  return timelineData;
};
