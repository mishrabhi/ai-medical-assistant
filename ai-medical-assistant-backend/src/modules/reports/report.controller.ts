import { Request, Response } from "express";
import { reportService } from "./report.service";

class ReportController {
  //upload
  upload = async (req: Request, res: Response) => {
    const report = await reportService.uploadReport(
      req.user!.userId,
      req.body,
      req.file!,
    );

    return res.status(201).json({
      success: true,
      message: "Medical reports uploaded successfully",
      data: report,
    });
  };

  //get all
  getAll = async (req: Request, res: Response) => {
    const reports = await reportService.getReports(req.user!.userId);
    return res.json({
      success: true,
      data: reports,
    });
  };

  //getById
  getById = async (req: Request, res: Response) => {
    const report = await reportService.getReportById(
      req.params.id as string,
      req.user!.userId,
    );

    return res.json({
      success: true,
      data: report,
    });
  };

  //delete
  delete = async (req: Request, res: Response) => {
    await reportService.deleteReport(req.params.id as string, req.user!.userId);

    return res.json({
      success: true,
      message: "Medical report deleted successfully.",
    });
  };

  //process OCR
  processOCR = async (req: Request, res: Response) => {
    const result = await reportService.processOCR(
      req.params.id as string,
      req.user!.userId,
    );

    return res.status(200).json({
      success: true,
      message: "OCR processing completed successfully.",
      data: result,
    });
  };

  //ai service
  analyze = async (
  req: Request,
  res: Response
) => {
  const result =
    await reportService.analyzeReport(
      req.params.id as string,
      req.user!.userId
    );

  return res.status(200).json({
    success: true,
    message:
      "Medical report analysis completed successfully.",
    data: result,
  });
};
  //get analysed report
  getAnalysis = async (
  req: Request,
  res: Response
) => {
  const report =
    await reportService.getAnalyzedReport(
      req.params.id as string,
      req.user!.userId
    );

  return res.status(200).json({
    success: true,
    message: "Medical report analysis fetched successfully.",
    data: report,
  });
};

//get file
getFile = async (req: Request, res: Response) => {
  const result = await reportService.getReportFile(
    req.params.id as string,
    req.user!.userId,
  );

  res.setHeader("Content-Type", result.mimeType);

  return res.sendFile(result.filePath);
};
}

export const reportController = new ReportController();
