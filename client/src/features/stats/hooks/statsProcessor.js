import {
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  format,
  startOfDay,
  endOfDay,
} from "date-fns";

/**
 * Filters sessions for today.
 */
export const filterSessionsForToday = (sessions) => {
  console.log("Sessions: ", sessions);
  if (!Array.isArray(sessions)) return [];
  const todayInterval = {
    start: startOfDay(new Date()),
    end: endOfDay(new Date()),
  };

  return sessions.filter((session) => {
    if (!session.timestamp) return false;
    try {
      // No timezone conversion needed. Just parse the ISO string.
      const sessionDate = parseISO(session.timestamp);
      return isWithinInterval(sessionDate, todayInterval);
    } catch (error) {
      console.error("filterSessionsForToday: Error parsing timestamp", error);
      return false;
    }
  });
};

/**
 * Filters sessions for the current week.
 */
export const filterSessionsForThisWeek = (
  sessions,
  options = { weekStartsOn: 0 }
) => {
  if (!Array.isArray(sessions)) return [];
  const weekInterval = {
    start: startOfWeek(new Date(), options),
    end: endOfWeek(new Date(), options),
  };

  return sessions.filter((session) => {
    if (!session.timestamp) return false;
    try {
      const sessionDate = parseISO(session.timestamp);
      return isWithinInterval(sessionDate, weekInterval);
    } catch (error) {
      console.error(
        "filterSessionsForThisWeek: Error parsing timestamp",
        error
      );
      return false;
    }
  });
};

/**
 * Filters sessions for the current month.
 */
export const filterSessionsForThisMonth = (sessions) => {
  if (!Array.isArray(sessions)) return [];
  const monthInterval = {
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  };

  return sessions.filter((session) => {
    if (!session.timestamp) return false;
    try {
      const sessionDate = parseISO(session.timestamp);
      return isWithinInterval(sessionDate, monthInterval);
    } catch (error) {
      console.error(
        "filterSessionsForThisMonth: Error parsing timestamp",
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
 * Groups sessions by category and calculates total time spent per category.
 * Now includes an "Unassigned" category for tasks without a category.
 */
export const aggregateTimeByCategory = (sessions) => {
  if (!Array.isArray(sessions)) return [];
  const categoryTimeMap = new Map();

  sessions.forEach((session) => {
    if (typeof session.duration !== "number") return;

    let categoryName = "Unassigned";
    let categoryColor = "#8884d8"; // Default color for unassigned

    // Check if a valid category object exists
    if (
      session.categoryId &&
      typeof session.categoryId === "object" &&
      session.categoryId.name
    ) {
      categoryName = session.categoryId.name;
      categoryColor = session.categoryId.color || categoryColor;
    }

    const currentTotal = categoryTimeMap.get(categoryName)?.value || 0;
    categoryTimeMap.set(categoryName, {
      value: currentTotal + session.duration,
      color: categoryColor,
    });
  });

  // Convert map to array format suitable for Recharts (e.g., PieChart)
  return Array.from(categoryTimeMap, ([name, data]) => ({
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
