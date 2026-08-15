import { appointmentRepository } from "./appointment.repository";
import { CreateAppointmentDTO } from "./appointment.types";

class AppointmentService {
  //create appointment
  async createAppointment(userId: string, data: CreateAppointmentDTO) {
    const appointmentDate = new Date(data.appointmentDate);

    if (appointmentDate <= new Date()) {
      throw new Error("Appointment date must be in the future.");
    }

    const doctor = await appointmentRepository.findDoctorById(data.doctorId);

    if (!doctor) {
      throw new Error("Doctor not found.");
    }

    if (!doctor.isAvailable) {
      throw new Error("Doctor is currently unavailable.");
    }

    const existingAppointment =
      await appointmentRepository.findExistingAppointment(
        data.doctorId,
        appointmentDate,
      );

    if (existingAppointment) {
      throw new Error("This appointment slot is already booked.");
    }

    return appointmentRepository.create(userId, data);
  }

  //get appointment of user
  async getAppointments(userId: string) {
    return appointmentRepository.findAllByUser(userId);
  }

  async getAppointmentById(id: string, userId: string) {
    const appointment = await appointmentRepository.findById(id, userId);

    if (!appointment) {
      throw new Error("Appointment not found.");
    }

    return appointment;
  }

  //update status
  async updateStatus(
    id: string,
    userId: string,
    status: "CONFIRMED" | "COMPLETED" | "CANCELLED",
  ) {
    const appointment = await appointmentRepository.findById(id, userId);

    if (!appointment) {
      throw new Error("Appointment not found.");
    }

    if (appointment.status === "CANCELLED") {
      throw new Error("Cancelled appointment cannot be updated.");
    }

    if (appointment.status === "COMPLETED") {
      throw new Error("Completed appointment cannot be updated.");
    }

    if (status === "COMPLETED" && appointment.status !== "CONFIRMED") {
      throw new Error("Only confirmed appointments can be completed.");
    }

    await appointmentRepository.updateStatus(id, userId, status);

    return appointmentRepository.findById(id, userId);
  }

  //delete appointment
  async deleteAppointment(id: string, userId: string) {
    const appointment = await appointmentRepository.findById(id, userId);

    if (!appointment) {
      throw new Error("Appointment not found.");
    }

    if (appointment.status === "COMPLETED") {
      throw new Error("Completed appointment cannot be deleted.");
    }

    await appointmentRepository.delete(id, userId);

    return {
      message: "Appointment deleted successfully.",
    };
  }
}

export const appointmentService = new AppointmentService();
