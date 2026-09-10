import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
} from "../services/project.service";

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const project = await createProject(
      name,
      description,
      req.userId
    );

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProjects = async (
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

    const projects = await getMyProjects(req.userId);

    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = Number(req.params.id);

    if (isNaN(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const project = await getProjectById(
      projectId,
      req.userId
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const update = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = Number(req.params.id);

    if (isNaN(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const project = await updateProject(
      projectId,
      req.userId,
      name,
      description
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you are not a member",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}; 

export const remove = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = Number(req.params.id);

    if (isNaN(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const project = await deleteProject(
      projectId,
      req.userId
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you are not a member",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addMember = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = Number(req.params.id);

    if (isNaN(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const { memberUserId } = req.body;

    if (!memberUserId) {
      return res.status(400).json({
        success: false,
        message: "Member user ID is required",
      });
    }

    const member = await addProjectMember(
      projectId,
      req.userId,
      Number(memberUserId)
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found, user not found, or user is already a member",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Project member added successfully",
      member,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};