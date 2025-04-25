User
- id
- email
- name
- passwordHash

Project (optional at first, but good for grouping tasks)
- id
- userId (foreign key)
- title
- description

Task
- id
- userId (foreign key)
- projectId (optional, foreign key)
- title
- isComplete (boolean)
- createdAt
- pomodoroCount
- focusDuration (total time focused)

PomodoroSession
 -id

- taskId

 - startTime

- endTime

- duration

- wasInterrupted (boolean?)