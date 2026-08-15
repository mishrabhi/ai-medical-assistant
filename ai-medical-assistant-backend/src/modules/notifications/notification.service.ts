import { notificationRepository } from "./notification.repository";

class NotificationService {
    //get notifications
  async getNotifications(userId: string) {
    return notificationRepository.findAllByUser(userId);
  }

  //marks as read
  async markAsRead(id: string, userId: string) {
    const result = await notificationRepository.markAsRead(id, userId);

    if (result.count === 0) {
      throw new Error("Notification not found.");
    }

    return {
      message: "Notification marked as read.",
    };
  }

  //mark all as read
  async markAllAsRead(userId: string) {
    await notificationRepository.markAllAsRead(userId);

    return {
      message: "All notifications marked as read.",
    };
  }

  //create reminder notification
  async createReminderNotification(
  userId: string,
  reminderTitle: string
) {
  return notificationRepository.create(
    userId,
    "Medication Reminder",
    `It's time for: ${reminderTitle}`
  );
}
}

export const notificationService = new NotificationService();
