export enum ReminderStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
}

export enum RepeatInterval {
  NONE = "NONE",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  CUSTOM = "CUSTOM",
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  scheduledFor: string;
  repeatInterval: RepeatInterval;
  status: ReminderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderPayload {
  title: string;
  description?: string;
  scheduledFor: string;
  repeatInterval: RepeatInterval;
}

export interface UpdateReminderPayload {
  title?: string;
  description?: string;
  scheduledFor?: string;
  repeatInterval?: RepeatInterval;
}
