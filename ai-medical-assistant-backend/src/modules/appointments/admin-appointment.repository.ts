import { prisma } from "../../lib/prisma";

class AdminAppointmentRepository {
  async findAll() {
    return prisma.appointment.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        doctor: true,
      },
      orderBy: {
        appointmentDate: "asc",
      },
    });
  }

  async findById(id: string) {
    return prisma.appointment.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        doctor: true,
      },
    });
  }

  async updateStatus(
    id: string,
    status: "CONFIRMED" | "COMPLETED" | "CANCELLED",
  ) {
    return prisma.appointment.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        doctor: true,
      },
    });
  }
}

export const adminAppointmentRepository = new AdminAppointmentRepository();
