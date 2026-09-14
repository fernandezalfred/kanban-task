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
import { BoardForm, type BoardFormValues } from "./BoardForm";
import { useKanbanStore } from "@/store/kanban-store";

export function CreateBoardModal() {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const createBoard = useKanbanStore((state) => state.createBoard);
  const createColumn = useKanbanStore((state) => state.createColumn);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) setFormKey((key) => key + 1);
  }

  function handleSubmit(values: BoardFormValues) {
    createBoard(values.name);
    const newBoardId = useKanbanStore.getState().selectedBoardId;
    if (newBoardId) {
      for (const column of values.columns) {
        createColumn(newBoardId, column.name);
      }
    }
    setOpen(false);
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
        />
      </DialogContent>
    </Dialog>
  );
}
