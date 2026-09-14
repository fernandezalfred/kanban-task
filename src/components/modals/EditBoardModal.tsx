"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BoardForm, type BoardFormValues } from "./BoardForm";
import { useKanbanStore } from "@/store/kanban-store";
import type { Board } from "@/types/kanban";

type EditBoardModalProps = {
  board: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditBoardModal({
  board,
  open,
  onOpenChange,
}: EditBoardModalProps) {
  const [formKey, setFormKey] = useState(0);
  const updateBoard = useKanbanStore((state) => state.updateBoard);
  const createColumn = useKanbanStore((state) => state.createColumn);
  const updateColumn = useKanbanStore((state) => state.updateColumn);
  const deleteColumn = useKanbanStore((state) => state.deleteColumn);

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (next) setFormKey((key) => key + 1);
  }

  function handleSubmit(values: BoardFormValues) {
    if (values.name !== board.name) {
      updateBoard(board.id, values.name);
    }

    const submittedIds = new Set(values.columns.map((c) => c.id));
    for (const original of board.columns) {
      if (!submittedIds.has(original.id)) {
        deleteColumn(original.id);
      }
    }

    for (const column of values.columns) {
      const original = board.columns.find((c) => c.id === column.id);
      if (!original) {
        createColumn(board.id, column.name);
      } else if (original.name !== column.name) {
        updateColumn(column.id, column.name);
      }
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Edit Board
          </DialogTitle>
        </DialogHeader>
        <BoardForm
          key={formKey}
          defaultValues={{
            name: board.name,
            columns: board.columns.map((c) => ({ id: c.id, name: c.name })),
          }}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
