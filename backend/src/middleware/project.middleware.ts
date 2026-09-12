import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import prisma from "../config/prisma";

export const requireProjectRole = (
  allowedRoles: string[]
) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "User is not authenticated",
        });
      }

      const projectId = Number(req.params.id);

      if (isNaN(projectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        });
      }

      const projectMember = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: req.userId,
            projectId,
          },
        },
      });

      if (!projectMember) {
        return res.status(403).json({
          success: false,
          message: "You are not a member of this project",
        });
      }

      if (!allowedRoles.includes(projectMember.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action",
        });
      }

      next();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};