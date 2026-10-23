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
import { BoardForm, type BoardFormValues } from "./BoardForm";
import {
  updateBoard,
  createColumn,
  updateColumn,
  deleteColumn,
} from "@/actions/boards";
import { slugify } from "@/lib/slug";
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
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (next) {
      setFormKey((key) => key + 1);
    }
  }

  function handleSubmit(values: BoardFormValues) {
    startTransition(async () => {
      const operations: Promise<{ success: boolean }>[] = [];

      if (values.name !== board.name) {
        operations.push(updateBoard({ boardId: board.id, name: values.name }));
      }

      const submittedIds = new Set(values.columns.map((c) => c.id));
      for (const original of board.columns) {
        if (!submittedIds.has(original.id)) {
          operations.push(deleteColumn({ columnId: original.id }));
        }
      }

      for (const column of values.columns) {
        const original = board.columns.find((c) => c.id === column.id);
        if (!original) {
          operations.push(
            createColumn({ boardId: board.id, name: column.name })
          );
        } else if (original.name !== column.name) {
          operations.push(
            updateColumn({ columnId: column.id, name: column.name })
          );
        }
      }

      const results = await Promise.all(operations);
      if (results.some((result) => !result.success)) {
        toast.error("Some changes failed to save. Please try again.");
        return;
      }

      if (values.name !== board.name) {
        router.push(`/dashboard/${slugify(values.name)}`);
      } else {
        router.refresh();
      }
      onOpenChange(false);
    });
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
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
