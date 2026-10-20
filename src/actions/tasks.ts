"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Task } from "@/types/kanban";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

const taskInclude = { subtasks: true } as const;

const createTaskSchema = z.object({
  columnId: z.string().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim(),
  subtasks: z.array(z.object({ title: z.string().trim().min(1) })),
});

export async function createTask(
  input: z.infer<typeof createTaskSchema>
): Promise<ActionResult<Task>> {
  try {
    const { columnId, title, description, subtasks } =
      createTaskSchema.parse(input);
    const column = await prisma.column.findUniqueOrThrow({
      where: { id: columnId },
      select: { name: true },
    });
    const task = await prisma.task.create({
      data: {
        columnId,
        title,
        description,
        status: column.name,
        subtasks: { create: subtasks.map((subtask) => ({ title: subtask.title })) },
      },
      include: taskInclude,
    });
    return { success: true, data: task };
  } catch {
    return { success: false, error: "Failed to create task" };
  }
}

const updateTaskSchema = z.object({
  taskId: z.string().min(1),
  columnId: z.string().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim(),
  subtasks: z.array(
    z.object({
      id: z.string(),
      title: z.string().trim().min(1),
      isCompleted: z.boolean(),
    })
  ),
});

export async function updateTask(
  input: z.infer<typeof updateTaskSchema>
): Promise<ActionResult<null>> {
  try {
    const { taskId, columnId, title, description, subtasks } =
      updateTaskSchema.parse(input);

    const column = await prisma.column.findUniqueOrThrow({
      where: { id: columnId },
      select: { name: true },
    });
    const existingSubtasks = await prisma.subtask.findMany({
      where: { taskId },
      select: { id: true },
    });
    const existingIds = new Set(existingSubtasks.map((subtask) => subtask.id));
    const incomingIds = new Set(
      subtasks.filter((subtask) => existingIds.has(subtask.id)).map((s) => s.id)
    );

    const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
    const toUpdate = subtasks.filter((subtask) => existingIds.has(subtask.id));
    const toCreate = subtasks.filter((subtask) => !existingIds.has(subtask.id));

    await Promise.all([
      toDelete.length > 0
        ? prisma.subtask.deleteMany({ where: { id: { in: toDelete } } })
        : Promise.resolve(),
      ...toUpdate.map((subtask) =>
        prisma.subtask.update({
          where: { id: subtask.id },
          data: { title: subtask.title, isCompleted: subtask.isCompleted },
        })
      ),
      ...toCreate.map((subtask) =>
        prisma.subtask.create({
          data: { taskId, title: subtask.title, isCompleted: subtask.isCompleted },
        })
      ),
    ]);

    await prisma.task.update({
      where: { id: taskId },
      data: { title, description, columnId, status: column.name },
    });

    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to update task" };
  }
}

const deleteTaskSchema = z.object({ taskId: z.string().min(1) });

export async function deleteTask(
  input: z.infer<typeof deleteTaskSchema>
): Promise<ActionResult<null>> {
  try {
    const { taskId } = deleteTaskSchema.parse(input);
    await prisma.subtask.deleteMany({ where: { taskId } });
    await prisma.task.delete({ where: { id: taskId } });
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to delete task" };
  }
}

const moveTaskSchema = z.object({
  taskId: z.string().min(1),
  destinationColumnId: z.string().min(1),
});

export async function moveTask(
  input: z.infer<typeof moveTaskSchema>
): Promise<ActionResult<null>> {
  try {
    const { taskId, destinationColumnId } = moveTaskSchema.parse(input);
    const column = await prisma.column.findUniqueOrThrow({
      where: { id: destinationColumnId },
      select: { name: true },
    });
    await prisma.task.update({
      where: { id: taskId },
      data: { columnId: destinationColumnId, status: column.name },
    });
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to move task" };
  }
}

const toggleSubtaskSchema = z.object({ subtaskId: z.string().min(1) });

export async function toggleSubtask(
  input: z.infer<typeof toggleSubtaskSchema>
): Promise<ActionResult<null>> {
  try {
    const { subtaskId } = toggleSubtaskSchema.parse(input);
    const subtask = await prisma.subtask.findUniqueOrThrow({
      where: { id: subtaskId },
      select: { isCompleted: true },
    });
    await prisma.subtask.update({
      where: { id: subtaskId },
      data: { isCompleted: !subtask.isCompleted },
    });
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to toggle subtask" };
  }
}
