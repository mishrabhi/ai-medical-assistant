import { notificationRepository } from "./notification.repository";
import { ApiError } from "../../utils/ApiError";

class NotificationService {
  // Get notifications
  async getNotifications(userId: string) {
    return notificationRepository.findAllByUser(userId);
  }

  // Mark as read
  async markAsRead(id: string, userId: string) {
    const result = await notificationRepository.markAsRead(
      id,
      userId,
    );

    if (result.count === 0) {
      throw new ApiError(404, "Notification not found.");
    }

    return {
      message: "Notification marked as read.",
    };
  }

  // Mark all as read
  async markAllAsRead(userId: string) {
    await notificationRepository.markAllAsRead(userId);

    return {
      message: "All notifications marked as read.",
    };
  }

  // Get unread count
  async getUnreadCount(userId: string) {
    return notificationRepository.countUnreadByUser(userId);
  }

  // Reminder notification
  async createReminderNotification(
    userId: string,
    reminderTitle: string,
  ) {
    return notificationRepository.create(
      userId,
      "Medication Reminder",
      `It's time for: ${reminderTitle}`,
    );
  }

  // Appointment notification
  async createAppointmentNotification(
    userId: string,
    title: string,
    message: string,
  ) {
    return notificationRepository.create(
      userId,
      title,
      message,
    );
  }
}

export const notificationService =
  new NotificationService();