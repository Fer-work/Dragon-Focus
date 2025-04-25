class User {
  constructor(id, email, name, passwordHash) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.passwordHash = passwordHash;
  }
}

class Project {
  constructor(id, userId, title, description = "") {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description;
  }
}

class Task {
  constructor(
    id,
    userId,
    title,
    projectId = null,
    isComplete = false,
    createdAt = new Date(),
    pomodoroCount = 0,
    focusDuration = 0
  ) {
    this.id = id;
    this.userId = userId;
    this.projectId = projectId;
    this.title = title;
    this.isComplete = isComplete;
    this.createdAt = createdAt;
    this.pomodoroCount = pomodoroCount;
    this.focusDuration = focusDuration; // Total focus time in milliseconds (for easier addition)
  }
}

class PomodoroSession {
  constructor(id, taskId, startTime, endTime = null, wasInterrupted = false) {
    this.id = id;
    this.taskId = taskId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.duration = endTime ? endTime.getTime() - startTime.getTime() : null; // Duration in milliseconds
    this.wasInterrupted = wasInterrupted;
  }

  finishSession(endTime, wasInterrupted = false) {
    this.endTime = endTime;
    this.duration = endTime.getTime() - this.startTime.getTime();
    this.wasInterrupted = wasInterrupted;
  }
}

export { User, Project, Task, PomodoroSession };
