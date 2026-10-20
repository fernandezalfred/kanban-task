"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditTaskModal } from "./EditTaskModal";
import { DeleteConfirmationDialog } from "@/components/modals/DeleteConfirmationDialog";
import { toggleSubtask, moveTask, deleteTask } from "@/actions/tasks";
import { cn } from "@/lib/utils";
import type { Column, Task } from "@/types/kanban";

type TaskDetailsModalProps = {
  task: Task;
  columnId: string;
  columns: Column[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TaskDetailsModal({
  task,
  columnId,
  columns,
  open,
  onOpenChange,
}: TaskDetailsModalProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const completedCount = task.subtasks.filter((s) => s.isCompleted).length;

  async function handleToggleSubtask(subtaskId: string) {
    const result = await toggleSubtask({ subtaskId });
    if (result.success) router.refresh();
  }

  async function handleStatusChange(newColumnId: string) {
    if (newColumnId === columnId) return;
    const result = await moveTask({
      taskId: task.id,
      destinationColumnId: newColumnId,
    });
    if (result.success) router.refresh();
  }

  async function handleDeleteTask() {
    const result = await deleteTask({ taskId: task.id });
    if (result.success) {
      router.refresh();
      onOpenChange(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex-row items-start justify-between gap-2 space-y-0">
            <DialogTitle className="text-base font-bold">
              {task.title}
            </DialogTitle>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Task options"
                className="mr-6 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DialogHeader>

          {task.description && (
            <p className="text-sm text-muted-foreground">
              {task.description}
            </p>
          )}

          {task.subtasks.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>
                Subtasks ({completedCount} of {task.subtasks.length})
              </Label>
              <div className="flex flex-col gap-2">
                {task.subtasks.map((subtask) => (
                  <label
                    key={subtask.id}
                    className="flex items-center gap-3 rounded-md bg-muted px-3 py-2.5 text-sm"
                  >
                    <Checkbox
                      checked={subtask.isCompleted}
                      onCheckedChange={() => handleToggleSubtask(subtask.id)}
                    />
                    <span
                      className={cn(
                        subtask.isCompleted &&
                          "text-muted-foreground line-through"
                      )}
                    >
                      {subtask.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label>Status</Label>
            <Select
              items={Object.fromEntries(columns.map((column) => [column.id, column.name]))}
              value={columnId}
              onValueChange={(value) => handleStatusChange(value as string)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column.id} value={column.id}>
                    {column.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>

      <EditTaskModal
        task={task}
        columnId={columnId}
        columns={columns}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this task?"
        description={`Are you sure you want to delete the '${task.title}' task and its subtasks? This action cannot be reversed.`}
        onConfirm={handleDeleteTask}
      />
    </>
  );
}
