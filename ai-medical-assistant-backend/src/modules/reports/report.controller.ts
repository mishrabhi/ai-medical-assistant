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
  getAll = async(
    req: Request,
    res: Response
  ) => {
    const reports = await reportService.getReports(
      req.user!.userId
    )
    return res.json({
      success: true,
      data: reports
    })
  }

  //getById
 getById = async (
  req: Request,
  res: Response
) => {
  const report =
    await reportService.getReportById(
      req.params.id as string,
      req.user!.userId
    );

  return res.json({
    success: true,
    data: report,
  });
};

  //delete
  delete = async (
  req: Request,
  res: Response
) => {
  await reportService.deleteReport(
    req.params.id as string,
    req.user!.userId
  );

  return res.json({
    success: true,
    message:
      "Medical report deleted successfully.",
  });
}
}

export const reportController = new ReportController();
