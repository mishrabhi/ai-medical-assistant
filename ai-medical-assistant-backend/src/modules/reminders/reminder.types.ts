export interface CreateReminderDTO {
  title: string;
  description?: string;
  scheduledFor: string;
  repeatInterval?:
    | "NONE"
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY"
    | "CUSTOM";
}

export interface UpdateReminderDTO {
  title?: string;
  description?: string;
  scheduledFor?: string;
  repeatInterval?:
    | "NONE"
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY"
    | "CUSTOM";
}