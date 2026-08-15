import { Request, Response } from "express";
import { adminService } from "./admin.service";

class AdminController {
  getDashboard = async (
    _req: Request,
    res: Response
  ) => {
    const result =
      await adminService.getDashboardStats();

    return res.status(200).json({
      success: true,
      message:
        "Admin dashboard data fetched successfully.",
      data: result,
    });
  };
}

export const adminController =
  new AdminController();