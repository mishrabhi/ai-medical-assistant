import { Request, Response } from "express";
import { adminAppointmentService } from "./admin-appointment.service";

class AdminAppointmentController {
  getAll = async (_req: Request, res: Response) => {
    const result =
      await adminAppointmentService.getAppointments();

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully.",
      data: result,
    });
  };

  getById = async (req: Request, res: Response) => {
    const result =
      await adminAppointmentService.getAppointmentById(
        req.params.id as string,
      );

    return res.status(200).json({
      success: true,
      message: "Appointment fetched successfully.",
      data: result,
    });
  };

  updateStatus = async (
    req: Request,
    res: Response,
  ) => {
    const result =
      await adminAppointmentService.updateStatus(
        req.params.id as string,
        req.body.status,
      );

    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully.",
      data: result,
    });
  };
}

export const adminAppointmentController =
  new AdminAppointmentController();