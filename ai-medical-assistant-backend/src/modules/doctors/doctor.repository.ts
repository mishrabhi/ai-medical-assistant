import { prisma } from "../../lib/prisma";
import { CreateDoctorDTO, UpdateDoctorDTO } from "./doctor.types";

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

  async updateAvailability(id: string, isAvailable: boolean) {
    return prisma.doctor.updateMany({
      where: {
        id,
      },
      data: {
        isAvailable,
      },
    });
  }

  async update(id: string, data: UpdateDoctorDTO) {
    return prisma.doctor.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.doctor.delete({
      where: {
        id,
      },
    });
  }
}

export const doctorRepository = new DoctorRepository();
