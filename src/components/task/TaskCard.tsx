"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { Column, Task } from "@/types/kanban";
import { TaskDetailsModal } from "./TaskDetailsModal";

export function TaskCardBody({ task }: { task: Task }) {
  const completedCount = task.subtasks.filter((s) => s.isCompleted).length;

  return (
    <>
      <h3 className="text-sm font-bold text-foreground">{task.title}</h3>
      {task.subtasks.length > 0 && (
        <p className="mt-2 text-xs font-bold text-muted-foreground">
          {completedCount} of {task.subtasks.length} subtasks
        </p>
      )}
    </>
  );
}

type TaskCardProps = {
  task: Task;
  columnId: string;
  columns: Column[];
};

export function TaskCard({ task, columnId, columns }: TaskCardProps) {
  const [open, setOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id, data: { columnId } });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <>
      <button
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "touch-none rounded-lg bg-card px-4 py-6 text-left shadow-sm ring-1 ring-border/50 transition-shadow hover:shadow-md",
          isDragging && "opacity-30"
        )}
      >
        <TaskCardBody task={task} />
      </button>
      <TaskDetailsModal
        task={task}
        columnId={columnId}
        columns={columns}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
