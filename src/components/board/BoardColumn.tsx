"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { Column } from "@/types/kanban";
import { TaskCard } from "@/components/task/TaskCard";

const COLUMN_ACCENT_COLORS = ["#49C4E5", "#8471F2", "#67E2AE"];

export function BoardColumn({
  column,
  index,
  columns,
}: {
  column: Column;
  index: number;
  columns: Column[];
}) {
  const accentColor = COLUMN_ACCENT_COLORS[index % COLUMN_ACCENT_COLORS.length];
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex w-[280px] shrink-0 flex-col gap-6">
      <div className="flex items-center gap-3">
        <span
          className="size-4 shrink-0 rounded-full"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
        <h2 className="text-xs font-bold tracking-[0.15em] text-muted-foreground">
          {column.name.toUpperCase()} ({column.tasks.length})
        </h2>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-5 rounded-lg transition-colors",
          isOver && "bg-primary/5 outline-2 outline-dashed outline-primary/30"
        )}
      >
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={column.id}
            columns={columns}
          />
        ))}
      </div>
    </div>
  );
}
