import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createTask } from "../services/task.service";

export const create = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      title,
      description,
      priority,
      projectId,
      assigneeId,
    } = req.body;

    if (!title || !projectId || !assigneeId) {
      return res.status(400).json({
        success: false,
        message: "Title, project ID, and assignee ID are required",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const task = await createTask(
      title,
      description,
      priority || "MEDIUM",
      Number(projectId),
      Number(assigneeId),
      req.userId
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you are not a member",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};