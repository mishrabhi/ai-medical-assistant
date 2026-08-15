import { Request, Response } from "express";
import { reminderService } from "./reminder.service";

class ReminderController {
  //create reminder
  create = async (req: Request, res: Response) => {
    const result = await reminderService.createReminder(
      req.user!.userId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Reminder created successfully.",
      data: result,
    });
  };

  //get all reminder
  getAll = async (req: Request, res: Response) => {
    const result = await reminderService.getReminders(req.user!.userId);

    return res.status(200).json({
      success: true,
      message: "Reminders fetched successfully.",
      data: result,
    });
  };

  //get reminder by Id
  getById = async (req: Request, res: Response) => {
    const result = await reminderService.getReminderById(
      req.params.id as string,
      req.user!.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Reminder fetched successfully.",
      data: result,
    });
  };

  //update reminder
  update = async (req: Request, res: Response) => {
    const result = await reminderService.updateReminder(
      req.params.id as string,
      req.user!.userId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Reminder updated successfully.",
      data: result,
    });
  };

  //delete reminder
  delete = async (req: Request, res: Response) => {
    const result = await reminderService.deleteReminder(
      req.params.id as string,
      req.user!.userId,
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  };

  //update status
  updateStatus = async (req: Request, res: Response) => {
    const result = await reminderService.updateStatus(
      req.params.id as string,
      req.user!.userId,
      req.body.status,
    );

    return res.status(200).json({
      success: true,
      message: "Reminder status updated successfully.",
      data: result,
    });
  };

  //complete reminder
  complete = async (req: Request, res: Response) => {
    const result = await reminderService.completeReminder(
      req.params.id as string,
      req.user!.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Reminder completed successfully.",
      data: result,
    });
  };
}

export const reminderController = new ReminderController();
