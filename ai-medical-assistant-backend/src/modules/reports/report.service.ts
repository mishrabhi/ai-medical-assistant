import { UploadReportDTO } from "./report.types";
import { reportRepository } from "./report.repository";
import fs from "fs/promises";
import path from "path";

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
  async deleteReport(
  reportId: string,
  userId: string
) {
  const report = await reportRepository.findById(
    reportId,
    userId
  );

  if (!report) {
    throw new Error("Medical report not found.");
  }

  // Delete physical file
  await fs.unlink(
    path.join(
      process.cwd(),
      report.fileUrl.replace(/^\//, "")
    )
  ).catch(() => {
    // Ignore if file is already missing
  });

  // Delete database record
  await reportRepository.delete(
    reportId,
    userId
  );
}
}

export const reportService = new ReportService();
