import type { Task } from "@/types/kanban";

export function TaskCard({ task }: { task: Task }) {
  const completedCount = task.subtasks.filter((s) => s.isCompleted).length;

  return (
    <div className="rounded-lg bg-card px-4 py-6 shadow-sm ring-1 ring-border/50 transition-shadow hover:shadow-md">
      <h3 className="text-sm font-bold text-foreground">{task.title}</h3>
      {task.subtasks.length > 0 && (
        <p className="mt-2 text-xs font-bold text-muted-foreground">
          {completedCount} of {task.subtasks.length} subtasks
        </p>
      )}
    </div>
  );
}
