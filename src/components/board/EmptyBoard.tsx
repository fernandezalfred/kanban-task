"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditBoardModal } from "@/components/modals/EditBoardModal";
import type { Board } from "@/types/kanban";

export function EmptyBoard({ board }: { board: Board }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="max-w-xs text-sm font-bold text-muted-foreground">
        This board is empty. Create a new column to get started.
      </p>
      <Button
        size="lg"
        className="gap-1 rounded-full px-6"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
        Add New Column
      </Button>
      <EditBoardModal board={board} open={open} onOpenChange={setOpen} />
    </div>
  );
}
