import { prisma } from "../../lib/prisma";

class AdminRepository {
  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      totalDoctors,
      availableDoctors,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments,
      totalReports,
      totalSymptomChecks,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          isActive: true,
        },
      }),

      prisma.doctor.count(),

      prisma.doctor.count({
        where: {
          isAvailable: true,
        },
      }),

      prisma.appointment.count(),

      prisma.appointment.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.appointment.count({
        where: {
          status: "COMPLETED",
        },
      }),

      prisma.appointment.count({
        where: {
          status: "CANCELLED",
        },
      }),

      prisma.medicalReport.count(),

      prisma.symptomCheck.count(),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
      },

      doctors: {
        total: totalDoctors,
        available: availableDoctors,
      },

      appointments: {
        total: totalAppointments,
        pending: pendingAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
      },

      medicalReports: totalReports,

      symptomChecks: totalSymptomChecks,
    };
  }
}

export const adminRepository =
  new AdminRepository();