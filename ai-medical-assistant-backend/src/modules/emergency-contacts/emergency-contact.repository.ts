import { prisma } from "../../lib/prisma";
import {
  CreateEmergencyContactDTO,
  UpdateEmergencyContactDTO,
} from "./emergency-contact.types";

class EmergencyContactRepository {
  async create(
    userId: string,
    data: CreateEmergencyContactDTO
  ) {
    return prisma.emergencyContact.create({
      data: {
        userId,
        name: data.name,
        relation: data.relation,
        phone: data.phone,
      },
    });
  }

  async findAllByUser(userId: string) {
    return prisma.emergencyContact.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(
    id: string,
    userId: string
  ) {
    return prisma.emergencyContact.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: UpdateEmergencyContactDTO
  ) {
    return prisma.emergencyContact.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),

        ...(data.relation !== undefined && {
          relation: data.relation,
        }),

        ...(data.phone !== undefined && {
          phone: data.phone,
        }),
      },
    });
  }

  async delete(
    id: string,
    userId: string
  ) {
    return prisma.emergencyContact.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }
}

export const emergencyContactRepository =
  new EmergencyContactRepository();