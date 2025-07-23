import {
  isToday, // Checks if a date is today
  parseISO, // Parses an ISO date string (like the one from your DB)
  startOfWeek, // Gets the start of a week for a given date
  endOfWeek, // Gets the end of a week
  startOfMonth, // Gets the start of a month
  endOfMonth, // Gets the end of a month
  isWithinInterval, // Checks if a date is within a given interval
  format,
  startOfDay,
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
 * Now includes an "Unassigned" category for tasks without a project.
 */
export const aggregateTimeByProject = (sessions) => {
  if (!Array.isArray(sessions)) return [];

  const projectTimeMap = new Map();

  sessions.forEach((session) => {
    if (typeof session.duration !== "number") return;

    let projectName = "Unassigned";
    let projectColor = "#8884d8"; // Default color for unassigned

    // Check if a valid project object exists
    if (
      session.projectId &&
      typeof session.projectId === "object" &&
      session.projectId.name
    ) {
      projectName = session.projectId.name;
      projectColor = session.projectId.color || projectColor;
    }

    const currentTotal = projectTimeMap.get(projectName)?.value || 0;
    projectTimeMap.set(projectName, {
      value: currentTotal + session.duration,
      color: projectColor,
    });
  });

  // Convert map to array format suitable for Recharts (e.g., PieChart)
  return Array.from(projectTimeMap, ([name, data]) => ({
    name,
    value: data.value,
    fill: data.color,
  }));
};

/**
 * Prepares data for a timeline chart in a more performant way.
 */
export const prepareTimelineData = (sessions, numberOfDays = 7) => {
  if (!Array.isArray(sessions)) return [];

  // 1. First, create a map of total minutes per day from the sessions.
  // This is much faster as we only loop through the sessions array ONCE.
  const dailyMinutesMap = new Map();
  sessions.forEach((session) => {
    if (!session.timestamp || typeof session.duration !== "number") return;
    try {
      const dayKey = format(
        startOfDay(parseISO(session.timestamp)),
        "yyyy-MM-dd"
      );
      const currentMinutes = dailyMinutesMap.get(dayKey) || 0;
      dailyMinutesMap.set(dayKey, currentMinutes + session.duration);
    } catch (error) {
      console.error(
        "prepareTimelineData: Error parsing session timestamp",
        session.timestamp,
        error
      );
    }
  });

  // 2. Now, build the timeline for the last N days.
  const timelineData = [];
  const today = startOfDay(new Date());

  for (let i = numberOfDays - 1; i >= 0; i--) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);

    const dayKey = format(targetDate, "yyyy-MM-dd");
    const totalMinutesForDate = dailyMinutesMap.get(dayKey) || 0;

    timelineData.push({
      // Use date-fns format for consistent output (e.g., 'Mon', 'Tue')
      date: format(targetDate, "EEE"),
      minutes: totalMinutesForDate,
    });
  }
  return timelineData;
};
