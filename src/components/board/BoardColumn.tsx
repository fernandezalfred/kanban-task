import type { Column } from "@/types/kanban";
import { TaskCard } from "@/components/task/TaskCard";

const COLUMN_ACCENT_COLORS = ["#49C4E5", "#8471F2", "#67E2AE"];

export function BoardColumn({
  column,
  index,
}: {
  column: Column;
  index: number;
}) {
  const accentColor = COLUMN_ACCENT_COLORS[index % COLUMN_ACCENT_COLORS.length];

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
      <div className="flex flex-col gap-5">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
