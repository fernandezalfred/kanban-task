import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    board: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    column: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    task: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
      updateMany: vi.fn(),
    },
    subtask: {
      deleteMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  createBoard,
  updateBoard,
  deleteBoard,
  createColumn,
  updateColumn,
  deleteColumn,
} from "./boards";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createBoard", () => {
  it("creates a board with columns on valid input", async () => {
    const board = { id: "b1", name: "New Board", columns: [] };
    vi.mocked(prisma.board.create).mockResolvedValue(board as never);

    const result = await createBoard({
      name: "New Board",
      columnNames: ["Todo", "Doing"],
    });

    expect(result).toEqual({ success: true, data: board });
    expect(prisma.board.create).toHaveBeenCalledWith({
      data: {
        name: "New Board",
        columns: {
          create: [{ name: "Todo" }, { name: "Doing" }],
        },
      },
      include: expect.any(Object),
    });
  });

  it("rejects an empty name without hitting the database", async () => {
    const result = await createBoard({ name: "  ", columnNames: [] });

    expect(result).toEqual({ success: false, error: "Failed to create board" });
    expect(prisma.board.create).not.toHaveBeenCalled();
  });

  it("returns a failure result when prisma throws", async () => {
    vi.mocked(prisma.board.create).mockRejectedValue(new Error("connection lost"));

    const result = await createBoard({ name: "New Board", columnNames: [] });

    expect(result).toEqual({ success: false, error: "Failed to create board" });
  });
});

describe("updateBoard", () => {
  it("updates the board name on valid input", async () => {
    vi.mocked(prisma.board.update).mockResolvedValue({} as never);

    const result = await updateBoard({ boardId: "b1", name: "Renamed" });

    expect(result).toEqual({ success: true, data: null });
    expect(prisma.board.update).toHaveBeenCalledWith({
      where: { id: "b1" },
      data: { name: "Renamed" },
    });
  });

  it("rejects a blank boardId without hitting the database", async () => {
    const result = await updateBoard({ boardId: "", name: "Renamed" });

    expect(result).toEqual({ success: false, error: "Failed to update board" });
    expect(prisma.board.update).not.toHaveBeenCalled();
  });

  it("returns a failure result when the board doesn't exist", async () => {
    vi.mocked(prisma.board.update).mockRejectedValue(new Error("Record not found"));

    const result = await updateBoard({ boardId: "missing", name: "Renamed" });

    expect(result).toEqual({ success: false, error: "Failed to update board" });
  });
});

describe("deleteBoard", () => {
  it("deletes subtasks, tasks, columns, then the board in order", async () => {
    vi.mocked(prisma.column.findMany).mockResolvedValue([
      { id: "c1" },
      { id: "c2" },
    ] as never);
    vi.mocked(prisma.task.findMany).mockResolvedValue([{ id: "t1" }] as never);
    vi.mocked(prisma.subtask.deleteMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.task.deleteMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.column.deleteMany).mockResolvedValue({ count: 2 } as never);
    vi.mocked(prisma.board.delete).mockResolvedValue({} as never);

    const result = await deleteBoard({ boardId: "b1" });

    expect(result).toEqual({ success: true, data: null });
    expect(prisma.subtask.deleteMany).toHaveBeenCalledWith({
      where: { taskId: { in: ["t1"] } },
    });
    expect(prisma.task.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["t1"] } },
    });
    expect(prisma.column.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["c1", "c2"] } },
    });
    expect(prisma.board.delete).toHaveBeenCalledWith({ where: { id: "b1" } });

    const subtaskOrder = vi.mocked(prisma.subtask.deleteMany).mock.invocationCallOrder[0];
    const taskOrder = vi.mocked(prisma.task.deleteMany).mock.invocationCallOrder[0];
    const columnOrder = vi.mocked(prisma.column.deleteMany).mock.invocationCallOrder[0];
    const boardOrder = vi.mocked(prisma.board.delete).mock.invocationCallOrder[0];
    expect(subtaskOrder).toBeLessThan(taskOrder);
    expect(taskOrder).toBeLessThan(columnOrder);
    expect(columnOrder).toBeLessThan(boardOrder);
  });

  it("returns a failure result when the board doesn't exist", async () => {
    vi.mocked(prisma.column.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.task.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.subtask.deleteMany).mockResolvedValue({ count: 0 } as never);
    vi.mocked(prisma.task.deleteMany).mockResolvedValue({ count: 0 } as never);
    vi.mocked(prisma.column.deleteMany).mockResolvedValue({ count: 0 } as never);
    vi.mocked(prisma.board.delete).mockRejectedValue(new Error("Record not found"));

    const result = await deleteBoard({ boardId: "missing" });

    expect(result).toEqual({ success: false, error: "Failed to delete board" });
  });
});

describe("createColumn", () => {
  it("creates a column on valid input", async () => {
    vi.mocked(prisma.column.create).mockResolvedValue({
      id: "c1",
      name: "Todo",
    } as never);

    const result = await createColumn({ boardId: "b1", name: "Todo" });

    expect(result).toEqual({
      success: true,
      data: { id: "c1", name: "Todo" },
    });
    expect(prisma.column.create).toHaveBeenCalledWith({
      data: { boardId: "b1", name: "Todo" },
      select: { id: true, name: true },
    });
  });

  it("rejects an empty name without hitting the database", async () => {
    const result = await createColumn({ boardId: "b1", name: "  " });

    expect(result).toEqual({ success: false, error: "Failed to create column" });
    expect(prisma.column.create).not.toHaveBeenCalled();
  });
});

describe("updateColumn", () => {
  it("updates the column name and syncs status on its tasks", async () => {
    vi.mocked(prisma.column.update).mockResolvedValue({} as never);
    vi.mocked(prisma.task.updateMany).mockResolvedValue({ count: 2 } as never);

    const result = await updateColumn({ columnId: "c1", name: "Doing" });

    expect(result).toEqual({ success: true, data: null });
    expect(prisma.column.update).toHaveBeenCalledWith({
      where: { id: "c1" },
      data: { name: "Doing" },
    });
    expect(prisma.task.updateMany).toHaveBeenCalledWith({
      where: { columnId: "c1" },
      data: { status: "Doing" },
    });
  });

  it("returns a failure result when the column doesn't exist", async () => {
    vi.mocked(prisma.column.update).mockRejectedValue(new Error("Record not found"));

    const result = await updateColumn({ columnId: "missing", name: "Doing" });

    expect(result).toEqual({ success: false, error: "Failed to update column" });
  });
});

describe("deleteColumn", () => {
  it("deletes subtasks, tasks, then the column in order", async () => {
    vi.mocked(prisma.task.findMany).mockResolvedValue([{ id: "t1" }] as never);
    vi.mocked(prisma.subtask.deleteMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.task.deleteMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.column.delete).mockResolvedValue({} as never);

    const result = await deleteColumn({ columnId: "c1" });

    expect(result).toEqual({ success: true, data: null });
    expect(prisma.subtask.deleteMany).toHaveBeenCalledWith({
      where: { taskId: { in: ["t1"] } },
    });
    expect(prisma.task.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["t1"] } },
    });
    expect(prisma.column.delete).toHaveBeenCalledWith({ where: { id: "c1" } });
  });

  it("returns a failure result when the column doesn't exist", async () => {
    vi.mocked(prisma.task.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.subtask.deleteMany).mockResolvedValue({ count: 0 } as never);
    vi.mocked(prisma.task.deleteMany).mockResolvedValue({ count: 0 } as never);
    vi.mocked(prisma.column.delete).mockRejectedValue(new Error("Record not found"));

    const result = await deleteColumn({ columnId: "missing" });

    expect(result).toEqual({ success: false, error: "Failed to delete column" });
  });
});
