import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    column: {
      findUniqueOrThrow: vi.fn(),
    },
    task: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    subtask: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      findUniqueOrThrow: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  toggleSubtask,
} from "./tasks";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createTask", () => {
  it("creates a task with the destination column's name as status", async () => {
    vi.mocked(prisma.column.findUniqueOrThrow).mockResolvedValue({
      name: "Todo",
    } as never);
    const task = {
      id: "t1",
      title: "New task",
      description: "",
      status: "Todo",
      subtasks: [],
    };
    vi.mocked(prisma.task.create).mockResolvedValue(task as never);

    const result = await createTask({
      columnId: "c1",
      title: "New task",
      description: "",
      subtasks: [{ title: "Step 1" }],
    });

    expect(result).toEqual({ success: true, data: task });
    expect(prisma.task.create).toHaveBeenCalledWith({
      data: {
        columnId: "c1",
        title: "New task",
        description: "",
        status: "Todo",
        subtasks: { create: [{ title: "Step 1" }] },
      },
      include: { subtasks: true },
    });
  });

  it("rejects a blank title without hitting the database", async () => {
    const result = await createTask({
      columnId: "c1",
      title: "  ",
      description: "",
      subtasks: [],
    });

    expect(result).toEqual({ success: false, error: "Failed to create task" });
    expect(prisma.task.create).not.toHaveBeenCalled();
  });

  it("returns a failure result when the column doesn't exist", async () => {
    vi.mocked(prisma.column.findUniqueOrThrow).mockRejectedValue(
      new Error("Record not found")
    );

    const result = await createTask({
      columnId: "missing",
      title: "New task",
      description: "",
      subtasks: [],
    });

    expect(result).toEqual({ success: false, error: "Failed to create task" });
    expect(prisma.task.create).not.toHaveBeenCalled();
  });
});

describe("updateTask", () => {
  it("creates, updates, and deletes subtasks based on the diff, then updates the task", async () => {
    vi.mocked(prisma.column.findUniqueOrThrow).mockResolvedValue({
      name: "Doing",
    } as never);
    vi.mocked(prisma.subtask.findMany).mockResolvedValue([
      { id: "s1" },
      { id: "s2" },
    ] as never);
    vi.mocked(prisma.subtask.deleteMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.subtask.update).mockResolvedValue({} as never);
    vi.mocked(prisma.subtask.create).mockResolvedValue({} as never);
    vi.mocked(prisma.task.update).mockResolvedValue({} as never);

    const result = await updateTask({
      taskId: "t1",
      columnId: "c1",
      title: "Updated title",
      description: "Updated description",
      subtasks: [
        { id: "s1", title: "Kept subtask", isCompleted: true },
        { id: "new-1", title: "New subtask", isCompleted: false },
      ],
    });

    expect(result).toEqual({ success: true, data: null });

    expect(prisma.subtask.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["s2"] } },
    });
    expect(prisma.subtask.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: { title: "Kept subtask", isCompleted: true },
    });
    expect(prisma.subtask.create).toHaveBeenCalledWith({
      data: { taskId: "t1", title: "New subtask", isCompleted: false },
    });
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: {
        title: "Updated title",
        description: "Updated description",
        columnId: "c1",
        status: "Doing",
      },
    });
  });

  it("rejects a blank title without hitting the database", async () => {
    const result = await updateTask({
      taskId: "t1",
      columnId: "c1",
      title: "  ",
      description: "",
      subtasks: [],
    });

    expect(result).toEqual({ success: false, error: "Failed to update task" });
    expect(prisma.task.update).not.toHaveBeenCalled();
  });

  it("returns a failure result when the destination column doesn't exist", async () => {
    vi.mocked(prisma.column.findUniqueOrThrow).mockRejectedValue(
      new Error("Record not found")
    );

    const result = await updateTask({
      taskId: "t1",
      columnId: "missing",
      title: "Updated title",
      description: "",
      subtasks: [],
    });

    expect(result).toEqual({ success: false, error: "Failed to update task" });
    expect(prisma.task.update).not.toHaveBeenCalled();
  });
});

describe("deleteTask", () => {
  it("deletes subtasks then the task", async () => {
    vi.mocked(prisma.subtask.deleteMany).mockResolvedValue({ count: 2 } as never);
    vi.mocked(prisma.task.delete).mockResolvedValue({} as never);

    const result = await deleteTask({ taskId: "t1" });

    expect(result).toEqual({ success: true, data: null });
    expect(prisma.subtask.deleteMany).toHaveBeenCalledWith({
      where: { taskId: "t1" },
    });
    expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: "t1" } });
  });

  it("returns a failure result when the task doesn't exist", async () => {
    vi.mocked(prisma.subtask.deleteMany).mockResolvedValue({ count: 0 } as never);
    vi.mocked(prisma.task.delete).mockRejectedValue(new Error("Record not found"));

    const result = await deleteTask({ taskId: "missing" });

    expect(result).toEqual({ success: false, error: "Failed to delete task" });
  });
});

describe("moveTask", () => {
  it("updates the task's columnId and status from the destination column", async () => {
    vi.mocked(prisma.column.findUniqueOrThrow).mockResolvedValue({
      name: "Done",
    } as never);
    vi.mocked(prisma.task.update).mockResolvedValue({} as never);

    const result = await moveTask({
      taskId: "t1",
      destinationColumnId: "c2",
    });

    expect(result).toEqual({ success: true, data: null });
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: { columnId: "c2", status: "Done" },
    });
  });

  it("returns a failure result when the destination column doesn't exist", async () => {
    vi.mocked(prisma.column.findUniqueOrThrow).mockRejectedValue(
      new Error("Record not found")
    );

    const result = await moveTask({ taskId: "t1", destinationColumnId: "missing" });

    expect(result).toEqual({ success: false, error: "Failed to move task" });
    expect(prisma.task.update).not.toHaveBeenCalled();
  });
});

describe("toggleSubtask", () => {
  it("flips isCompleted from false to true", async () => {
    vi.mocked(prisma.subtask.findUniqueOrThrow).mockResolvedValue({
      isCompleted: false,
    } as never);
    vi.mocked(prisma.subtask.update).mockResolvedValue({} as never);

    const result = await toggleSubtask({ subtaskId: "s1" });

    expect(result).toEqual({ success: true, data: null });
    expect(prisma.subtask.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: { isCompleted: true },
    });
  });

  it("flips isCompleted from true to false", async () => {
    vi.mocked(prisma.subtask.findUniqueOrThrow).mockResolvedValue({
      isCompleted: true,
    } as never);
    vi.mocked(prisma.subtask.update).mockResolvedValue({} as never);

    const result = await toggleSubtask({ subtaskId: "s1" });

    expect(result).toEqual({ success: true, data: null });
    expect(prisma.subtask.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: { isCompleted: false },
    });
  });

  it("returns a failure result when the subtask doesn't exist", async () => {
    vi.mocked(prisma.subtask.findUniqueOrThrow).mockRejectedValue(
      new Error("Record not found")
    );

    const result = await toggleSubtask({ subtaskId: "missing" });

    expect(result).toEqual({ success: false, error: "Failed to toggle subtask" });
    expect(prisma.subtask.update).not.toHaveBeenCalled();
  });
});
