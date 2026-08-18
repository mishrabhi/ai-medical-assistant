import { Request, Response } from "express";
import { notificationService } from "./notification.service";

class NotificationController {
  getAll = async (req: Request, res: Response) => {
    const result = await notificationService.getNotifications(req.user!.userId);

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully.",
      data: result,
    });
  };

  markAsRead = async (req: Request, res: Response) => {
    const result = await notificationService.markAsRead(
      req.params.id as string,
      req.user!.userId,
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  };

  markAllAsRead = async (req: Request, res: Response) => {
    const result = await notificationService.markAllAsRead(req.user!.userId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  };

  getUnreadCount = async (req: Request, res: Response) => {
    const count = await notificationService.getUnreadCount(req.user!.userId);

    return res.status(200).json({
      success: true,
      data: {
        count,
      },
    });
  };
}

export const notificationController = new NotificationController();
