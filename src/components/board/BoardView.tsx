"use client";

import { useState } from "react";
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
import { useKanbanStore } from "@/store/kanban-store";
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

export function BoardView({ board }: { board: Board }) {
  const moveTask = useKanbanStore((state) => state.moveTask);
  const [editBoardOpen, setEditBoardOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  if (board.columns.length === 0) {
    return <EmptyBoard board={board} />;
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveTask(findTask(board, event.active.id as string) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const sourceColumnId = active.data.current?.columnId as
      | string
      | undefined;
    const destinationColumnId = over.id as string;

    if (!sourceColumnId || sourceColumnId === destinationColumnId) return;
    moveTask(active.id as string, sourceColumnId, destinationColumnId);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="flex flex-1 gap-6 overflow-x-auto px-4 py-6 sm:px-6">
        {board.columns.map((column, index) => (
          <BoardColumn
            key={column.id}
            column={column}
            index={index}
            columns={board.columns}
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
