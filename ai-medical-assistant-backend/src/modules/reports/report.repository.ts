import { prisma } from "../../lib/prisma";
import { UploadReportDTO } from "./report.types";

class ReportRepository {
  //upload report
  async create(
    userId: string,
    data: UploadReportDTO,
    file: Express.Multer.File,
  ) {
    return prisma.medicalReport.create({
      data: {
        userId,
        title: data.title,
        reportType: data.reportType,
        fileName: file.filename,
        fileUrl: `/uploads/reports/${file.filename}`,
        mimeType: file.mimetype,
        fileSize: file.size,
      },
    });
  }

  //find user's all medical report
  async findAllByUser(userId: string) {
    return prisma.medicalReport.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  //find user medical report by Id
  async findById(id: string, userId: string) {
    return prisma.medicalReport.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  //delete user medical report
  async delete(id: string, userId: string) {
    return prisma.medicalReport.delete({
      where: {
        id,
      },
    });
  }

  //update ocr
  async updateOCRText(
  reportId: string,
  userId: string,
  ocrText: string
) {
  return prisma.medicalReport.updateMany({
    where: {
      id: reportId,
      userId,
    },
    data: {
      ocrText,
    },
  });
}
}

export const reportRepository = new ReportRepository();
