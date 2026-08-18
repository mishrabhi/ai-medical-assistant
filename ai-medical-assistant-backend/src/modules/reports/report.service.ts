import { UploadReportDTO } from "./report.types";
import { reportRepository } from "./report.repository";
import fs from "fs/promises";
import path from "path";
import { ocrService } from "../../services/ocr/ocr.service";
import { aiService } from "../../services/ai/ai.service";
import { ApiError } from "../../utils/ApiError";

class ReportService {
  //upload report
  async uploadReport(
    userId: string,
    data: UploadReportDTO,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new ApiError(400, "Medical report file is required");
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
      throw new ApiError(404, "Medical report not found");
    }

    return report;
  }

  //delete report
  async deleteReport(reportId: string, userId: string) {
    const report = await reportRepository.findById(reportId, userId);

    if (!report) {
      throw new ApiError(404, "Medical report not found.");
    }

    // Delete physical file
    const filePath = path.resolve(
      process.cwd(),
      report.fileUrl.replace(/^\/+/, ""),
    );

    await fs.unlink(filePath).catch(() => {
      // Ignore if file is already missing
    });

    // Delete database record
    const result = await reportRepository.delete(reportId, userId);

    if (result.count === 0) {
      throw new ApiError(404, "Medical report not found.");
    }
  }

  //process OCR text
  async processOCR(reportId: string, userId: string) {
    const report = await reportRepository.findById(reportId, userId);

    if (!report) {
      throw new ApiError(404, "Medical report not found.");
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
  async analyzeReport(reportId: string, userId: string) {
    const report = await reportRepository.findById(reportId, userId);

    if (!report) {
      throw new ApiError(404, "Medical report not found.");
    }

    if (!report.ocrText) {
      throw new ApiError(400, "OCR must be completed before AI analysis.");
    }

    const aiSummary = await aiService.analyzeMedicalReport(report.ocrText);

    await reportRepository.updateAISummary(reportId, userId, aiSummary);

    return {
      reportId,
      aiSummary,
    };
  }

  //get analyzed report
  async getAnalyzedReport(reportId: string, userId: string) {
    const report = await reportRepository.findAnalyzedReport(reportId, userId);

    if (!report) {
      throw new ApiError(404, "Medical report not found.");
    }

    return report;
  }

  //get reported file
  async getReportFile(reportId: string, userId: string) {
    const report = await reportRepository.findById(reportId, userId);

    if (!report) {
      throw new ApiError(404, "Medical report not found.");
    }

    const filePath = path.resolve(
      process.cwd(),
      report.fileUrl.replace(/^\/+/, ""),
    );

    return {
      filePath,
      mimeType: report.mimeType ?? "application/octet-stream",
    };
  }
}

export const reportService = new ReportService();
