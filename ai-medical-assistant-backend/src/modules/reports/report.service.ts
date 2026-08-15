import { UploadReportDTO } from "./report.types";
import { reportRepository } from "./report.repository";
import fs from "fs/promises";
import path from "path";
import { ocrService } from "../../services/ocr/ocr.service";
import { aiService } from "../../services/ai/ai.service";

class ReportService {
  //upload report
  async uploadReport(
    userId: string,
    data: UploadReportDTO,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error("Medical report file is required");
    }

    return reportRepository.create(userId, data, file);
  }

  //get reports
  async getReports(userId: string) {
    return reportRepository.findAllByUser(userId);
  }

  //get user report by Id
  async getReportById(reportId: string, userId: string) {
    const report = await reportRepository.findById(reportId, userId);

    if (!report) {
      throw new Error("Medical report not found");
    }

    return report;
  }

  //delete report
  async deleteReport(reportId: string, userId: string) {
    const report = await reportRepository.findById(reportId, userId);

    if (!report) {
      throw new Error("Medical report not found.");
    }

    // Delete physical file
    await fs
      .unlink(path.join(process.cwd(), report.fileUrl.replace(/^\//, "")))
      .catch(() => {
        // Ignore if file is already missing
      });

    // Delete database record
    await reportRepository.delete(reportId, userId);
  }

  //process OCR text
  async processOCR(reportId: string, userId: string) {
    const report = await reportRepository.findById(reportId, userId);

    if (!report) {
      throw new Error("Medical report not found.");
    }

    const filePath = path.join(
      process.cwd(),
      report.fileUrl.replace(/^\//, ""),
    );

    const text = await ocrService.extractText(filePath, report.mimeType ?? "");

    await reportRepository.updateOCRText(reportId, userId, text);

    return {
      reportId,
      text,
    };
  }

  //ai Service
  async analyzeReport(
  reportId: string,
  userId: string
) {
  const report =
    await reportRepository.findById(
      reportId,
      userId
    );

  if (!report) {
    throw new Error("Medical report not found.");
  }

  if (!report.ocrText) {
    throw new Error(
      "OCR must be completed before AI analysis."
    );
  }

  const aiSummary =
    await aiService.analyzeMedicalReport(
      report.ocrText
    );

  await reportRepository.updateAISummary(
    reportId,
    userId,
    aiSummary
  );

  return {
    reportId,
    aiSummary,
  };
}

//get analyzed report
async getAnalyzedReport(
  reportId: string,
  userId: string
) {
  const report =
    await reportRepository.findAnalyzedReport(
      reportId,
      userId
    );

  if (!report) {
    throw new Error("Medical report not found.");
  }

  return report;
}
}

export const reportService = new ReportService();
