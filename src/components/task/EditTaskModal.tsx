"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm, type TaskFormValues } from "./TaskForm";
import { useKanbanStore } from "@/store/kanban-store";
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
  const [formKey, setFormKey] = useState(0);
  const updateTask = useKanbanStore((state) => state.updateTask);
  const moveTask = useKanbanStore((state) => state.moveTask);

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (next) setFormKey((key) => key + 1);
  }

  function handleSubmit(values: TaskFormValues) {
    const column = columns.find((c) => c.id === values.columnId);
    if (!column) return;

    updateTask(task.id, {
      title: values.title,
      description: values.description,
      status: column.name,
      subtasks: values.subtasks.map((subtask) => ({
        id: subtask.id,
        title: subtask.title,
        isCompleted:
          task.subtasks.find((s) => s.id === subtask.id)?.isCompleted ??
          false,
      })),
    });

    if (values.columnId !== columnId) {
      moveTask(task.id, columnId, values.columnId);
    }

    onOpenChange(false);
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
        />
      </DialogContent>
    </Dialog>
  );
}
