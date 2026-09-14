"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TaskForm, type TaskFormValues } from "./TaskForm";
import { useKanbanStore } from "@/store/kanban-store";
import type { Board, Task } from "@/types/kanban";

export function AddTaskModal({ board }: { board: Board }) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const createTask = useKanbanStore((state) => state.createTask);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) setFormKey((key) => key + 1);
  }

  function handleSubmit(values: TaskFormValues) {
    const column = board.columns.find((c) => c.id === values.columnId);
    if (!column) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: values.title,
      description: values.description,
      status: column.name,
      subtasks: values.subtasks.map((subtask) => ({
        id: subtask.id,
        title: subtask.title,
        isCompleted: false,
      })),
    };

    createTask(values.columnId, task);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size="lg" className="gap-1 rounded-full px-3 sm:px-6" />
        }
      >
        <Plus className="size-4" />
        <span className="hidden sm:inline">Add New Task</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Add New Task
          </DialogTitle>
        </DialogHeader>
        <TaskForm
          key={formKey}
          columns={board.columns}
          defaultValues={{
            title: "",
            description: "",
            subtasks: [
              { id: crypto.randomUUID(), title: "" },
              { id: crypto.randomUUID(), title: "" },
            ],
            columnId: board.columns[0]?.id ?? "",
          }}
          submitLabel="Create Task"
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
