import { Request, Response } from "express";
import { doctorService } from "./doctor.service";

class DoctorController {
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

  getAll = async (
    _req: Request,
    res: Response
  ) => {
    const result =
      await doctorService.getDoctors();

    return res.status(200).json({
      success: true,
      message: "Doctors fetched successfully.",
      data: result,
    });
  };

  getById = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await doctorService.getDoctorById(
        req.params.id as string
      );

    return res.status(200).json({
      success: true,
      message: "Doctor fetched successfully.",
      data: result,
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

export const doctorController =
  new DoctorController();