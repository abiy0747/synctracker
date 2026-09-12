import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  updateProjectMember,
  getProjectMembers,
  removeProjectMember,
} from "../services/project.service";
import {
  PROJECT_MEMBER_ROLES,
  PROJECT_MEMBER_STATUSES,
} from "../constants/project.constants";

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

    const {
      memberUserId,
      role,
      responsibility,
      parentMemberId,
    } = req.body;

    // Validate member user ID
    if (!memberUserId) {
      return res.status(400).json({
        success: false,
        message: "Member user ID is required",
      });
    }

    // Validate role
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Member role is required",
      });
    }

    if (!PROJECT_MEMBER_ROLES.includes(role)) {
  return res.status(400).json({
    success: false,
    message: "Invalid member role",
    allowedRoles: PROJECT_MEMBER_ROLES,
  });
}

    // Convert IDs to numbers
    const parsedMemberUserId = Number(memberUserId);

    const parsedParentMemberId =
      parentMemberId !== undefined &&
      parentMemberId !== null &&
      parentMemberId !== ""
        ? Number(parentMemberId)
        : undefined;

    if (isNaN(parsedMemberUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member user ID",
      });
    }

    if (
      parsedParentMemberId !== undefined &&
      isNaN(parsedParentMemberId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent member ID",
      });
    }

    const member = await addProjectMember(
      projectId,
      req.userId,
      parsedMemberUserId,
      role,
      responsibility,
      parsedParentMemberId
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found, user not found, user is already a member, or parent member is invalid",
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


export const updateMember = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = Number(req.params.id);
    const memberId = Number(req.params.memberId);

    if (isNaN(projectId) || isNaN(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID or member ID",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const {
      role,
      responsibility,
      status,
      parentMemberId,
    } = req.body;


   if (role !== undefined && !PROJECT_MEMBER_ROLES.includes(role)) {
  return res.status(400).json({
    success: false,
    message: "Invalid member role",
    allowedRoles: PROJECT_MEMBER_ROLES,
  });
}

if (
  status !== undefined &&
  !PROJECT_MEMBER_STATUSES.includes(status)
) {
  return res.status(400).json({
    success: false,
    message: "Invalid member status",
    allowedStatuses: PROJECT_MEMBER_STATUSES,
  });
}

  
    let parsedParentMemberId:
      | number
      | null
      | undefined;

    if (parentMemberId === undefined) {
      parsedParentMemberId = undefined;
    } else if (
      parentMemberId === null ||
      parentMemberId === ""
    ) {
      parsedParentMemberId = null;
    } else {
      parsedParentMemberId = Number(parentMemberId);

      if (isNaN(parsedParentMemberId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid parent member ID",
        });
      }
    }

    const member = await updateProjectMember(
      projectId,
      req.userId,
      memberId,
      role,
      responsibility,
      status,
      parsedParentMemberId
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message:
          "Project or project member not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project member updated successfully",
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

export const getMembers = async (
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

    const members = await getProjectMembers(
      projectId,
      req.userId
    );

    if (!members) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      members,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeMember = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = Number(req.params.id);
    const memberUserId = Number(req.params.userId);

    if (isNaN(projectId) || isNaN(memberUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID or user ID",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const removedMember = await removeProjectMember(
      projectId,
      req.userId,
      memberUserId
    );

    if (!removedMember) {
      return res.status(404).json({
        success: false,
        message: "Project or member not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project member removed successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};