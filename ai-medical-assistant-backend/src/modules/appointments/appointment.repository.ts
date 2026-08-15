import { prisma } from "../../lib/prisma";
import { CreateAppointmentDTO } from "./appointment.types";

class AppointmentRepository {
    //create-appointment
  async create(userId: string, data: CreateAppointmentDTO) {
    return prisma.appointment.create({
      data: {
        userId,
        doctorId: data.doctorId,
        appointmentDate: new Date(data.appointmentDate),
        reason: data.reason,
        notes: data.notes,
      },
      include: {
        doctor: true,
      },
    });
  }

  //find doctor by Id
  async findDoctorById(doctorId: string) {
    return prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
    });
  }

  //find existing appointment
  async findExistingAppointment(doctorId: string, appointmentDate: Date) {
    return prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate,
        status: {
          not: "CANCELLED",
        },
      },
    });
  }

  //find all appointment of user
  async findAllByUser(userId: string) {
    return prisma.appointment.findMany({
      where: {
        userId,
      },
      include: {
        doctor: true,
      },
      orderBy: {
        appointmentDate: "asc",
      },
    });
  }

  //find appointment by Id
  async findById(id: string, userId: string) {
    return prisma.appointment.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        doctor: true,
      },
    });
  }

  //update status
  async updateStatus(
    id: string,
    userId: string,
    status: "CONFIRMED" | "COMPLETED" | "CANCELLED",
  ) {
    return prisma.appointment.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        status,
      },
    });
  }

  //delete appointment
  async delete(id: string, userId: string) {
    return prisma.appointment.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }
}

export const appointmentRepository = new AppointmentRepository();
