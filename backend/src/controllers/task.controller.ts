import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createTask,
  getMyTasks,
  getTaskById,
} from "../services/task.service";

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

export const getTasks = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const tasks = await getMyTasks(req.userId);

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const taskId = Number(req.params.id);

    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const task = await getTaskById(
      taskId,
      req.userId
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
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