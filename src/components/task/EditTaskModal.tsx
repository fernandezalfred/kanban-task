"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm, type TaskFormValues } from "./TaskForm";
import { updateTask } from "@/actions/tasks";
import type { Column, Task } from "@/types/kanban";

type EditTaskModalProps = {
  task: Task;
  columnId: string;
  columns: Column[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditTaskModal({
  task,
  columnId,
  columns,
  open,
  onOpenChange,
}: EditTaskModalProps) {
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (next) {
      setFormKey((key) => key + 1);
    }
  }

  function handleSubmit(values: TaskFormValues) {
    startTransition(async () => {
      const result = await updateTask({
        taskId: task.id,
        columnId: values.columnId,
        title: values.title,
        description: values.description,
        subtasks: values.subtasks.map((subtask) => ({
          id: subtask.id,
          title: subtask.title,
          isCompleted:
            task.subtasks.find((s) => s.id === subtask.id)?.isCompleted ??
            false,
        })),
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      router.refresh();
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Edit Task</DialogTitle>
        </DialogHeader>
        <TaskForm
          key={formKey}
          columns={columns}
          defaultValues={{
            title: task.title,
            description: task.description,
            subtasks: task.subtasks.map((s) => ({ id: s.id, title: s.title })),
            columnId,
          }}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
