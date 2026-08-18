import { ApiError } from "../../utils/ApiError";
import { notificationService } from "../notifications/notification.service";
import { adminAppointmentRepository } from "./admin-appointment.repository";
import { logger } from "../../utils/logger";

class AdminAppointmentService {
  async getAppointments() {
    return adminAppointmentRepository.findAll();
  }

  async getAppointmentById(id: string) {
    const appointment = await adminAppointmentRepository.findById(id);

    if (!appointment) {
      throw new ApiError(404, "Appointment not found.");
    }

    return appointment;
  }

  async updateStatus(
    id: string,
    status: "CONFIRMED" | "COMPLETED" | "CANCELLED",
  ) {
    const appointment = await adminAppointmentRepository.findById(id);

    if (!appointment) {
      throw new ApiError(404, "Appointment not found.");
    }

    if (appointment.status === "CANCELLED") {
      throw new ApiError(400, "Cancelled appointment cannot be updated.");
    }

    if (appointment.status === "COMPLETED") {
      throw new ApiError(400, "Completed appointment cannot be updated.");
    }

    if (status === "COMPLETED" && appointment.status !== "CONFIRMED") {
      throw new ApiError(400, "Only confirmed appointments can be completed.");
    }

    const updated = await adminAppointmentRepository.updateStatus(id, status);

    const doctorName = appointment.doctor.fullName;

    const appointmentDate = new Date(
      appointment.appointmentDate,
    ).toLocaleString();

    try {
      if (status === "CONFIRMED") {
        await notificationService.createAppointmentNotification(
          appointment.user.id,
          "Appointment Confirmed",
          `Your appointment with ${doctorName} scheduled for ${appointmentDate} has been confirmed.`,
        );
      }

      if (status === "CANCELLED") {
        await notificationService.createAppointmentNotification(
          appointment.user.id,
          "Appointment Cancelled",
          `Your appointment with ${doctorName} scheduled for ${appointmentDate} has been cancelled.`,
        );
      }

      if (status === "COMPLETED") {
        await notificationService.createAppointmentNotification(
          appointment.user.id,
          "Appointment Completed",
          `Your appointment with ${doctorName} has been marked as completed.`,
        );
      }
    } catch (error) {
      logger.error("Failed to create appointment status notification", {
        error,
        userId: appointment.user.id,
        appointmentId: appointment.id,
        status,
      });
    }

    return updated;
  }
}

export const adminAppointmentService = new AdminAppointmentService();
