import { prisma } from "../../lib/prisma";
import { CreateDoctorDTO } from "./doctor.types";

class DoctorRepository {
  async create(data: CreateDoctorDTO) {
    return prisma.doctor.create({
      data,
    });
  }

  async findAll() {
    return prisma.doctor.findMany({
      orderBy: {
        fullName: "asc",
      },
    });
  }

  async findById(id: string) {
    return prisma.doctor.findUnique({
      where: {
        id,
      },
    });
  }

  async updateAvailability(
    id: string,
    isAvailable: boolean
  ) {
    return prisma.doctor.updateMany({
      where: {
        id,
      },
      data: {
        isAvailable,
      },
    });
  }
}

export const doctorRepository =
  new DoctorRepository();