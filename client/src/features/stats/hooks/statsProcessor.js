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
  startOfHour,
  getHours,
  getMonth,
  getYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
} from "date-fns";

/**
 * Filters sessions for today.
 */
export const filterSessionsForToday = (sessions) => {
  console.log("Sessions from filterSessionsForToday(): ", sessions);
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
export const prepareTimelineData = (sessions, period) => {
  if (!Array.isArray(sessions) || sessions.length === 0) return [];

  const now = new Date();
  const dailyMinutesMap = new Map();

  // Pre-process all sessions into a map for efficient lookups
  sessions.forEach((session) => {
    if (!session.timestamp || typeof session.duration !== "number") return;
    try {
      const date = parseISO(session.timestamp);
      console.log(`Date from the prepareTimeLineData function: ${date} `, date);
      const dayKey = format(startOfDay(date), "yyyy-MM-dd");
      const currentMinutes = dailyMinutesMap.get(dayKey) || 0;
      dailyMinutesMap.set(dayKey, currentMinutes + session.duration);
    } catch (error) {
      console.error(
        "Error parsing session timestamp in prepareTimelineData",
        error
      );
    }
  });

  switch (period) {
    case "today": {
      const hourlyMap = new Map();
      const todaySessions = filterSessionsForToday(sessions);
      todaySessions.forEach((session) => {
        const hour = getHours(parseISO(session.timestamp));
        hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + session.duration);
      });
      return Array.from({ length: 24 }, (_, i) => ({
        date: format(startOfHour(new Date(now.setHours(i))), "ha"),
        minutes: hourlyMap.get(i) || 0,
      }));
    }
    case "week": {
      const weekInterval = { start: startOfWeek(now), end: endOfWeek(now) };
      const days = eachDayOfInterval(weekInterval);
      return days.map((day) => {
        const dayKey = format(day, "yyyy-MM-dd");
        return {
          date: format(day, "EEE"),
          minutes: dailyMinutesMap.get(dayKey) || 0,
        };
      });
    }
    case "month": {
      const monthInterval = { start: startOfMonth(now), end: endOfMonth(now) };
      const days = eachDayOfInterval(monthInterval);
      return days.map((day) => {
        const dayKey = format(day, "yyyy-MM-dd");
        return {
          date: format(day, "d"), // 1, 2, 3, etc.
          minutes: dailyMinutesMap.get(dayKey) || 0,
        };
      });
    }
    case "all": {
      const monthlyMap = new Map();
      sessions.forEach((session) => {
        const date = parseISO(session.timestamp);
        const monthKey = format(startOfMonth(date), "yyyy-MM");
        monthlyMap.set(
          monthKey,
          (monthlyMap.get(monthKey) || 0) + session.duration
        );
      });

      const firstSessionDate = parseISO(sessions[0].timestamp);
      const yearInterval = {
        start: startOfYear(firstSessionDate),
        end: endOfYear(now),
      };
      const months = eachMonthOfInterval(yearInterval);

      return months.map((month) => {
        const monthKey = format(month, "yyyy-MM");
        return {
          date: format(month, "MMM"),
          minutes: monthlyMap.get(monthKey) || 0,
        };
      });
    }

    default:
      return [];
  }
};
