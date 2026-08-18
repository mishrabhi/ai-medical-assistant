import { appointmentRepository } from "./appointment.repository";
import { CreateAppointmentDTO } from "./appointment.types";
import { ApiError } from "../../utils/ApiError";
import { notificationService } from "../notifications/notification.service";
import { logger } from "../../utils/logger";

class AppointmentService {
  // Create appointment
  async createAppointment(userId: string, data: CreateAppointmentDTO) {
    const appointmentDate = new Date(data.appointmentDate);

    if (appointmentDate <= new Date()) {
      throw new ApiError(400, "Appointment date must be in the future.");
    }

    const doctor = await appointmentRepository.findDoctorById(data.doctorId);

    if (!doctor) {
      throw new ApiError(404, "Doctor not found.");
    }

    if (!doctor.isAvailable) {
      throw new ApiError(400, "Doctor is currently unavailable.");
    }

    const existingAppointment =
      await appointmentRepository.findExistingAppointment(
        data.doctorId,
        appointmentDate,
      );

    if (existingAppointment) {
      throw new ApiError(409, "This appointment slot is already booked.");
    }

    const appointment = await appointmentRepository.create(userId, data);

    try {
      await notificationService.createAppointmentNotification(
        userId,
        "Appointment Booked",
        `Your appointment with ${doctor.fullName} has been booked for ${appointmentDate.toLocaleString()}.`,
      );
    } catch (error) {
      logger.error("Failed to create appointment booking notification", {
        error,
        userId,
        appointmentId: appointment.id,
      });
    }

    return appointment;
  }

  // Get appointments of user
  async getAppointments(userId: string) {
    return appointmentRepository.findAllByUser(userId);
  }

  // Get appointment by ID
  async getAppointmentById(id: string, userId: string) {
    const appointment = await appointmentRepository.findById(id, userId);

    if (!appointment) {
      throw new ApiError(404, "Appointment not found.");
    }

    return appointment;
  }

  // Update appointment status
  async updateStatus(
    id: string,
    userId: string,
    status: "CONFIRMED" | "COMPLETED" | "CANCELLED",
  ) {
    const appointment = await appointmentRepository.findById(id, userId);

    if (!appointment) {
      throw new ApiError(404, "Appointment not found.");
    }

    // Patients can only cancel their own appointments.
    if (status !== "CANCELLED") {
      throw new ApiError(
        403,
        "You are not authorized to set this appointment status.",
      );
    }

    if (appointment.status === "CANCELLED") {
      throw new ApiError(400, "Appointment is already cancelled.");
    }

    if (appointment.status === "COMPLETED") {
      throw new ApiError(400, "Completed appointment cannot be cancelled.");
    }

    const updated = await appointmentRepository.updateStatus(
      id,
      userId,
      "CANCELLED",
    );

    try {
      await notificationService.createAppointmentNotification(
        userId,
        "Appointment Cancelled",
        `Your appointment with ${appointment.doctor.fullName} scheduled for ${new Date(
          appointment.appointmentDate,
        ).toLocaleString()} has been cancelled.`,
      );
    } catch (error) {
      logger.error("Failed to create appointment cancellation notification", {
        error,
        userId,
        appointmentId: appointment.id,
      });
    }

    return appointmentRepository.findById(id, userId);
  }

  // Delete appointment
  async deleteAppointment(id: string, userId: string) {
    const appointment = await appointmentRepository.findById(id, userId);

    if (!appointment) {
      throw new ApiError(404, "Appointment not found.");
    }

    if (appointment.status === "COMPLETED") {
      throw new ApiError(400, "Completed appointment cannot be deleted.");
    }

    await appointmentRepository.delete(id, userId);

    return {
      message: "Appointment deleted successfully.",
    };
  }
}

export const appointmentService = new AppointmentService();
