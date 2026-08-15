import { prisma } from "../../lib/prisma";

class SymptomRepository {
  async create(
    userId: string,
    symptoms: string[],
    analysis: object,
    riskLevel: "LOW" | "MEDIUM" | "HIGH",
  ) {
    return prisma.symptomCheck.create({
      data: {
        userId,
        symptoms,
        analysis,
        riskLevel,
      },
    });
  }

  async findAllByUser(userId: string) {
    return prisma.symptomCheck.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string, userId: string) {
    return prisma.symptomCheck.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async delete(
  id: string,
  userId: string
) {
  return prisma.symptomCheck.deleteMany({
    where: {
      id,
      userId,
    },
  });
}
}

export const symptomRepository = new SymptomRepository();
