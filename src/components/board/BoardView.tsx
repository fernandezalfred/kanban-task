"use client";

import { startTransition, useOptimistic, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { Board, Task } from "@/types/kanban";
import { moveTask } from "@/actions/tasks";
import { BoardColumn } from "./BoardColumn";
import { EmptyBoard } from "./EmptyBoard";
import { EditBoardModal } from "@/components/modals/EditBoardModal";
import { TaskCardBody } from "@/components/task/TaskCard";

function findTask(board: Board, taskId: string): Task | undefined {
  for (const column of board.columns) {
    const task = column.tasks.find((t) => t.id === taskId);
    if (task) return task;
  }
  return undefined;
}

type MoveTaskAction = { taskId: string; destinationColumnId: string };

function applyMoveTask(board: Board, action: MoveTaskAction): Board {
  let movedTask: Task | undefined;
  const columnsWithoutTask = board.columns.map((column) => {
    const task = column.tasks.find((t) => t.id === action.taskId);
    if (task) movedTask = task;
    return {
      ...column,
      tasks: column.tasks.filter((t) => t.id !== action.taskId),
    };
  });

  const destinationColumn = columnsWithoutTask.find(
    (column) => column.id === action.destinationColumnId
  );
  if (!movedTask || !destinationColumn) return board;

  const updatedTask: Task = { ...movedTask, status: destinationColumn.name };

  return {
    ...board,
    columns: columnsWithoutTask.map((column) =>
      column.id === action.destinationColumnId
        ? { ...column, tasks: [...column.tasks, updatedTask] }
        : column
    ),
  };
}

export function BoardView({ board }: { board: Board }) {
  const router = useRouter();
  const [optimisticBoard, applyMove] = useOptimistic(board, applyMoveTask);
  const [editBoardOpen, setEditBoardOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  if (optimisticBoard.columns.length === 0) {
    return <EmptyBoard board={board} />;
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveTask(findTask(optimisticBoard, event.active.id as string) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const sourceColumnId = active.data.current?.columnId as
      | string
      | undefined;
    const destinationColumnId = over.id as string;
    const taskId = active.id as string;

    if (!sourceColumnId || sourceColumnId === destinationColumnId) return;

    startTransition(async () => {
      applyMove({ taskId, destinationColumnId });
      const result = await moveTask({ taskId, destinationColumnId });
      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <DndContext
      id="kanban-board"
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="flex flex-1 gap-6 overflow-x-auto px-4 py-6 sm:px-6">
        {optimisticBoard.columns.map((column, index) => (
          <BoardColumn
            key={column.id}
            column={column}
            index={index}
            columns={optimisticBoard.columns}
          />
        ))}
        <div className="flex w-[280px] shrink-0 items-stretch">
          <button
            type="button"
            onClick={() => setEditBoardOpen(true)}
            className="flex w-full flex-1 items-center justify-center rounded-lg bg-muted/50 text-lg font-bold text-muted-foreground transition-colors hover:text-primary"
          >
            + New Column
          </button>
        </div>
      </div>
      <DragOverlay>
        {activeTask && (
          <div className="rounded-lg bg-card px-4 py-6 text-left shadow-lg ring-1 ring-border/50">
            <TaskCardBody task={activeTask} />
          </div>
        )}
      </DragOverlay>
      <EditBoardModal
        board={board}
        open={editBoardOpen}
        onOpenChange={setEditBoardOpen}
      />
    </DndContext>
  );
}
