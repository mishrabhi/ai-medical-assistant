import { Request, Response } from "express";
import { doctorService } from "./doctor.service";

class AdminDoctorController {
  create = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await doctorService.createDoctor(
        req.body
      );

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully.",
      data: result,
    });
  };

  update = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await doctorService.updateDoctor(
        req.params.id as string,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully.",
      data: result,
    });
  };

  delete = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await doctorService.deleteDoctor(
        req.params.id as string
      );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  };

  updateAvailability = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await doctorService.updateAvailability(
        req.params.id as string,
        req.body.isAvailable
      );

    return res.status(200).json({
      success: true,
      message:
        "Doctor availability updated successfully.",
      data: result,
    });
  };
}

export const adminDoctorController =
  new AdminDoctorController();