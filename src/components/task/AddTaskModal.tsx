"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { createTask } from "@/actions/tasks";
import type { Board } from "@/types/kanban";

export function AddTaskModal({ board }: { board: Board }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setFormKey((key) => key + 1);
      setError(null);
    }
  }

  function handleSubmit(values: TaskFormValues) {
    startTransition(async () => {
      const result = await createTask({
        columnId: values.columnId,
        title: values.title,
        description: values.description,
        subtasks: values.subtasks.map((subtask) => ({
          title: subtask.title,
        })),
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
      setOpen(false);
    });
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
          isSubmitting={isPending}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </DialogContent>
    </Dialog>
  );
}
