import { Request, Response } from "express";
import { symptomService } from "./symptom.service";

class SymptomController {
  check = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await symptomService.checkSymptoms(
        req.user!.userId,
        req.body
      );

    return res.status(201).json({
      success: true,
      message: "Symptom check completed successfully.",
      data: result,
    });
  };

  getHistory = async (
  req: Request,
  res: Response
) => {
  const result =
    await symptomService.getHistory(
      req.user!.userId
    );

  return res.status(200).json({
    success: true,
    message: "Symptom history fetched successfully.",
    data: result,
  });
};

getById = async (
  req: Request,
  res: Response
) => {
  const result =
    await symptomService.getById(
      req.params.id as string,
      req.user!.userId
    );

  return res.status(200).json({
    success: true,
    message: "Symptom check fetched successfully.",
    data: result,
  });
};

delete = async (
  req: Request,
  res: Response
) => {
  const result =
    await symptomService.delete(
      req.params.id as string,
      req.user!.userId
    );

  return res.status(200).json({
    success: true,
    message: result.message,
  });
};
}

export const symptomController =
  new SymptomController();