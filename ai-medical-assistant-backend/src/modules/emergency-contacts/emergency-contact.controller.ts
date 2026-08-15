import { Request, Response } from "express";
import {
  emergencyContactService,
} from "./emergency-contact.service";

class EmergencyContactController {
  //create emergency contact
  create = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await emergencyContactService.createContact(
        req.user!.userId,
        req.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Emergency contact created successfully.",
      data: result,
    });
  };

  //get all emergency contacts
  getAll = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await emergencyContactService.getContacts(
        req.user!.userId
      );

    return res.status(200).json({
      success: true,
      message:
        "Emergency contacts fetched successfully.",
      data: result,
    });
  };

  //get contact by id
  getById = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await emergencyContactService.getContactById(
        req.params.id as string,
        req.user!.userId
      );

    return res.status(200).json({
      success: true,
      message:
        "Emergency contact fetched successfully.",
      data: result,
    });
  };

  //update contact
  update = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await emergencyContactService.updateContact(
        req.params.id as string,
        req.user!.userId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Emergency contact updated successfully.",
      data: result,
    });
  };

  //delete contact
  delete = async (
    req: Request,
    res: Response
  ) => {
    const result =
      await emergencyContactService.deleteContact(
        req.params.id as string,
        req.user!.userId
      );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  };

  //get emergency contact 
  getEmergencyContacts = async (
  req: Request,
  res: Response
) => {
  const result =
    await emergencyContactService.getEmergencyContacts(
      req.user!.userId
    );

  return res.status(200).json({
    success: true,
    message:
      "Emergency contacts fetched successfully.",
    data: result,
  });
};
}

export const emergencyContactController =
  new EmergencyContactController();