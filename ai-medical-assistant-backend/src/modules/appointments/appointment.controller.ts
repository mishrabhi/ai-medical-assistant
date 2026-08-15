import { Request, Response } from "express";
import { appointmentService } from "./appointment.service";

class AppointmentController {
  //create new appointment
  create = async (req: Request, res: Response) => {
    const result = await appointmentService.createAppointment(
      req.user!.userId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      data: result,
    });
  };

  //get all appointment of single user
  getAll = async (req: Request, res: Response) => {
    const result = await appointmentService.getAppointments(req.user!.userId);

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully.",
      data: result,
    });
  };

  //get appointment by ID
  getById = async (req: Request, res: Response) => {
    const result = await appointmentService.getAppointmentById(
      req.params.id as string,
      req.user!.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Appointment fetched successfully.",
      data: result,
    });
  };

  //update appointment status
  updateStatus = async (req: Request, res: Response) => {
    const result = await appointmentService.updateStatus(
      req.params.id as string,
      req.user!.userId,
      req.body.status,
    );

    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully.",
      data: result,
    });
  };

  //delete appointment
  delete = async (req: Request, res: Response) => {
    const result = await appointmentService.deleteAppointment(
      req.params.id as string,
      req.user!.userId,
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  };
}

export const appointmentController = new AppointmentController();
