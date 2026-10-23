"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BoardForm, type BoardFormValues } from "./BoardForm";
import { createBoard } from "@/actions/boards";

export function CreateBoardModal({
  onCreated,
}: {
  onCreated: (board: { id: string; name: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setFormKey((key) => key + 1);
    }
  }

  function handleSubmit(values: BoardFormValues) {
    startTransition(async () => {
      const result = await createBoard({
        name: values.name,
        columnNames: values.columns.map((column) => column.name),
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      onCreated(result.data);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-r-full py-3 pr-6 pl-6 text-sm font-bold text-primary transition-colors hover:text-primary/80"
          />
        }
      >
        <Plus className="size-4 shrink-0" />
        <span>Create New Board</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Add New Board
          </DialogTitle>
        </DialogHeader>
        <BoardForm
          key={formKey}
          defaultValues={{
            name: "",
            columns: ["Todo", "Doing", "Done"].map((name) => ({
              id: crypto.randomUUID(),
              name,
            })),
          }}
          submitLabel="Create New Board"
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
