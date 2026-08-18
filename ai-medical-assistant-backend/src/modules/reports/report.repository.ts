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
  return prisma.medicalReport.deleteMany({
    where: {
      id,
      userId,
    },
  });
}

  //update ocr text
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

  //update AI summary
  async updateAISummary(
  reportId: string,
  userId: string,
  aiSummary: string
) {
  return prisma.medicalReport.updateMany({
    where: {
      id: reportId,
      userId,
    },
    data: {
      aiSummary,
    },
  });
}

//find analyzed report
async findAnalyzedReport(
  reportId: string,
  userId: string
) {
  return prisma.medicalReport.findFirst({
    where: {
      id: reportId,
      userId,
    },
    select: {
      id: true,
      title: true,
      reportType: true,
      fileName: true,
      fileUrl: true,
      mimeType: true,
      fileSize: true,
      ocrText: true,
      aiSummary: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
}

export const reportRepository = new ReportRepository();
