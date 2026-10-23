"use client";

import { useState, type FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { boardFormSchema } from "@/lib/validation";

export type BoardFormValues = {
  name: string;
  columns: { id: string; name: string }[];
};

type BoardFormProps = {
  defaultValues: BoardFormValues;
  submitLabel: string;
  onSubmit: (values: BoardFormValues) => void;
  isSubmitting?: boolean;
};

export function BoardForm({
  defaultValues,
  submitLabel,
  onSubmit,
  isSubmitting = false,
}: BoardFormProps) {
  const [name, setName] = useState(defaultValues.name);
  const [columns, setColumns] = useState(defaultValues.columns);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateColumn(id: string, value: string) {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === id ? { ...column, name: value } : column
      )
    );
  }

  function removeColumn(id: string) {
    setColumns((prev) => prev.filter((column) => column.id !== id));
  }

  function addColumn() {
    setColumns((prev) => [...prev, { id: crypto.randomUUID(), name: "" }]);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const result = boardFormSchema.safeParse({
      name,
      columns: columns.filter((column) => column.name.trim().length > 0),
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
        <Label htmlFor="board-name">Board Name</Label>
        <Input
          id="board-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Web Design"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Board Columns</Label>
        {columns.map((column) => (
          <div key={column.id} className="flex items-center gap-2">
            <Input
              value={column.name}
              onChange={(event) => updateColumn(column.id, event.target.value)}
              placeholder="e.g. Todo"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => removeColumn(column.id)}
              aria-label="Remove column"
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
          onClick={addColumn}
        >
          + Add New Column
        </Button>
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
