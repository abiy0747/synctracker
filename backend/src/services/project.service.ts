import prisma from "../config/prisma";

export const createProject = async (
  name: string,
  description: string | undefined,
  userId: number
) => {
  const project = await prisma.project.create({
    data: {
      name,
      description,
      members: {
        create: {
          userId,
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return project;
};

export const getMyProjects = async (userId: number) => {
  const projects = await prisma.projectMember.findMany({
    where: {
      userId,
    },
    include: {
      project: true,
    },
  });

  return projects;
};

export const getProjectById = async (
  projectId: number,
  userId: number
) => {
  const projectMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
    include: {
      project: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          tasks: true,
        },
      },
    },
  });

  return projectMember?.project ?? null;
};

export const updateProject = async (
  projectId: number,
  userId: number,
  name: string,
  description: string | undefined
) => {
  const projectMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });

  if (!projectMember) {
    return null;
  }

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name,
      description,
    },
  });

  return project;
};

export const deleteProject = async (
  projectId: number,
  userId: number
) => {
  const projectMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });

  if (!projectMember) {
    return null;
  }

  const project = await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return project;
};

export const addProjectMember = async (
  projectId: number,
  userId: number,
  memberUserId: number
) => {
  const projectMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });

  if (!projectMember) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: memberUserId,
    },
  });

  if (!user) {
    return null;
  }

  const existingMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: memberUserId,
        projectId,
      },
    },
  });

  if (existingMember) {
    return null;
  }

  const newMember = await prisma.projectMember.create({
    data: {
      userId: memberUserId,
      projectId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return newMember;
};

export const getProjectMembers = async (
  projectId: number,
  userId: number
) => {
  const projectMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });

  if (!projectMember) {
    return null;
  }

  const members = await prisma.projectMember.findMany({
    where: {
      projectId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });

  return members;
};

export const removeProjectMember = async (
  projectId: number,
  userId: number,
  memberUserId: number
) => {
  // Check that the requesting user belongs to the project
  const projectMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });

  if (!projectMember) {
    return null;
  }

  // Find the member we want to remove
  const memberToRemove = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: memberUserId,
        projectId,
      },
    },
  });

  if (!memberToRemove) {
    return null;
  }

  // Remove the membership
  const removedMember = await prisma.projectMember.delete({
    where: {
      id: memberToRemove.id,
    },
  });

  return removedMember;
};