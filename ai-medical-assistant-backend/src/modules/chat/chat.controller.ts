import { Request, Response } from "express";
import { chatService } from "./chat.service";

class ChatController {
  //create session
  createSession = async (req: Request, res: Response) => {
    const result = await chatService.createSession(req.user!.userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Chat session created successfully.",
      data: result,
    });
  };

  //send-messages
  sendMessage = async (req: Request, res: Response) => {
    const result = await chatService.sendMessage(
      req.user!.userId,
      req.params.id as string,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Message sent successfully.",
      data: result,
    });
  };

  //get session by user Id
  getSessions = async (req: Request, res: Response) => {
    const result = await chatService.getSessions(req.user!.userId);

    return res.status(200).json({
      success: true,
      message: "Chat sessions fetched successfully.",
      data: result,
    });
  };

  //get sessions by session and user Id
  getSession = async (req: Request, res: Response) => {
    const result = await chatService.getSession(
      req.user!.userId,
      req.params.id as string,
    );

    return res.status(200).json({
      success: true,
      message: "Chat session fetched successfully.",
      data: result,
    });
  };

  //get-messages
  getMessages = async (req: Request, res: Response) => {
    const result = await chatService.getMessages(
      req.user!.userId,
      req.params.id as string,
    );

    return res.status(200).json({
      success: true,
      message: "Chat messages fetched successfully.",
      data: result,
    });
  };

  //archive session
  archiveSession = async (req: Request, res: Response) => {
    const result = await chatService.archiveSession(
      req.user!.userId,
      req.params.id as string,
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  };

  //delete session
  deleteSession = async (req: Request, res: Response) => {
    const result = await chatService.deleteSession(
      req.user!.userId,
      req.params.id as string,
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  };
}

export const chatController = new ChatController();
