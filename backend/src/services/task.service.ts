import prisma from "../config/prisma";

export const createTask = async (
  title: string,
  description: string | undefined,
  priority: string,
  projectId: number,
  assigneeId: number,
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

const assigneeMember = await prisma.projectMember.findUnique({
  where: {
    userId_projectId: {
      userId: assigneeId,
      projectId,
    },
  },
});

if (!assigneeMember) {
  return null;
}

const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      projectId,
      assigneeId,
    },
    include: {
      project: true,
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return task;
};

export const getMyTasks = async (userId: number) => {
  const tasks = await prisma.task.findMany({
    where: {
      project: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
    include: {
      project: true,
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tasks;
};

export const getTaskById = async (
  taskId: number,
  userId: number
) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
    include: {
      project: true,
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return task;
};