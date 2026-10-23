"use client";

import { useState, type FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { taskFormSchema } from "@/lib/validation";
import type { Column } from "@/types/kanban";

export type TaskFormValues = {
  title: string;
  description: string;
  subtasks: { id: string; title: string }[];
  columnId: string;
};

const SUBTASK_PLACEHOLDERS = ["e.g. Make coffee", "e.g. Drink coffee & smile"];

type TaskFormProps = {
  columns: Column[];
  defaultValues: TaskFormValues;
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => void;
  isSubmitting?: boolean;
};

export function TaskForm({
  columns,
  defaultValues,
  submitLabel,
  onSubmit,
  isSubmitting = false,
}: TaskFormProps) {
  const [title, setTitle] = useState(defaultValues.title);
  const [description, setDescription] = useState(defaultValues.description);
  const [subtasks, setSubtasks] = useState(defaultValues.subtasks);
  const [columnId, setColumnId] = useState(defaultValues.columnId);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateSubtask(id: string, value: string) {
    setSubtasks((prev) =>
      prev.map((subtask) =>
        subtask.id === id ? { ...subtask, title: value } : subtask
      )
    );
  }

  function removeSubtask(id: string) {
    setSubtasks((prev) => prev.filter((subtask) => subtask.id !== id));
  }

  function addSubtask() {
    setSubtasks((prev) => [...prev, { id: crypto.randomUUID(), title: "" }]);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const result = taskFormSchema.safeParse({
      title,
      description,
      subtasks: subtasks.filter((subtask) => subtask.title.trim().length > 0),
      columnId,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="task-title">Title</Label>
        <Input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Take coffee break"
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Subtasks</Label>
        {subtasks.map((subtask, index) => (
          <div key={subtask.id} className="flex items-center gap-2">
            <Input
              value={subtask.title}
              onChange={(event) => updateSubtask(subtask.id, event.target.value)}
              placeholder={SUBTASK_PLACEHOLDERS[index] ?? "e.g. New subtask"}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => removeSubtask(subtask.id)}
              aria-label="Remove subtask"
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          className="w-full rounded-full"
          onClick={addSubtask}
        >
          + Add New Subtask
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Status</Label>
        <Select
          items={Object.fromEntries(columns.map((column) => [column.id, column.name]))}
          value={columnId}
          onValueChange={(value) => setColumnId(value as string)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((column) => (
              <SelectItem key={column.id} value={column.id}>
                {column.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.columnId && (
          <p className="text-xs text-destructive">{errors.columnId}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full rounded-full"
        disabled={isSubmitting}
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
