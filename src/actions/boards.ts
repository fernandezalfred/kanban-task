"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Board } from "@/types/kanban";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

const boardInclude = {
  columns: { include: { tasks: { include: { subtasks: true } } } },
} as const;

export async function getBoards(): Promise<Board[]> {
  return prisma.board.findMany({ include: boardInclude });
}

const createBoardSchema = z.object({
  name: z.string().trim().min(1),
  columnNames: z.array(z.string().trim().min(1)),
});

export async function createBoard(
  input: z.infer<typeof createBoardSchema>
): Promise<ActionResult<Board>> {
  try {
    const { name, columnNames } = createBoardSchema.parse(input);
    const board = await prisma.board.create({
      data: {
        name,
        columns: { create: columnNames.map((columnName) => ({ name: columnName })) },
      },
      include: boardInclude,
    });
    return { success: true, data: board };
  } catch {
    return { success: false, error: "Failed to create board" };
  }
}

const updateBoardSchema = z.object({
  boardId: z.string().min(1),
  name: z.string().trim().min(1),
});

export async function updateBoard(
  input: z.infer<typeof updateBoardSchema>
): Promise<ActionResult<null>> {
  try {
    const { boardId, name } = updateBoardSchema.parse(input);
    await prisma.board.update({ where: { id: boardId }, data: { name } });
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to update board" };
  }
}

const deleteBoardSchema = z.object({ boardId: z.string().min(1) });

export async function deleteBoard(
  input: z.infer<typeof deleteBoardSchema>
): Promise<ActionResult<null>> {
  try {
    const { boardId } = deleteBoardSchema.parse(input);
    const columns = await prisma.column.findMany({
      where: { boardId },
      select: { id: true },
    });
    const columnIds = columns.map((column) => column.id);
    const tasks = await prisma.task.findMany({
      where: { columnId: { in: columnIds } },
      select: { id: true },
    });
    const taskIds = tasks.map((task) => task.id);

    await prisma.subtask.deleteMany({ where: { taskId: { in: taskIds } } });
    await prisma.task.deleteMany({ where: { id: { in: taskIds } } });
    await prisma.column.deleteMany({ where: { id: { in: columnIds } } });
    await prisma.board.delete({ where: { id: boardId } });

    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to delete board" };
  }
}

const createColumnSchema = z.object({
  boardId: z.string().min(1),
  name: z.string().trim().min(1),
});

export async function createColumn(
  input: z.infer<typeof createColumnSchema>
): Promise<ActionResult<{ id: string; name: string }>> {
  try {
    const { boardId, name } = createColumnSchema.parse(input);
    const column = await prisma.column.create({
      data: { boardId, name },
      select: { id: true, name: true },
    });
    return { success: true, data: column };
  } catch {
    return { success: false, error: "Failed to create column" };
  }
}

const updateColumnSchema = z.object({
  columnId: z.string().min(1),
  name: z.string().trim().min(1),
});

export async function updateColumn(
  input: z.infer<typeof updateColumnSchema>
): Promise<ActionResult<null>> {
  try {
    const { columnId, name } = updateColumnSchema.parse(input);
    await prisma.column.update({ where: { id: columnId }, data: { name } });
    await prisma.task.updateMany({ where: { columnId }, data: { status: name } });
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to update column" };
  }
}

const deleteColumnSchema = z.object({ columnId: z.string().min(1) });

export async function deleteColumn(
  input: z.infer<typeof deleteColumnSchema>
): Promise<ActionResult<null>> {
  try {
    const { columnId } = deleteColumnSchema.parse(input);
    const tasks = await prisma.task.findMany({
      where: { columnId },
      select: { id: true },
    });
    const taskIds = tasks.map((task) => task.id);

    await prisma.subtask.deleteMany({ where: { taskId: { in: taskIds } } });
    await prisma.task.deleteMany({ where: { id: { in: taskIds } } });
    await prisma.column.delete({ where: { id: columnId } });

    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to delete column" };
  }
}
