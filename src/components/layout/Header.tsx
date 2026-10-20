"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddTaskModal } from "@/components/task/AddTaskModal";
import { EditBoardModal } from "@/components/modals/EditBoardModal";
import { DeleteConfirmationDialog } from "@/components/modals/DeleteConfirmationDialog";
import { deleteBoard as deleteBoardAction } from "@/actions/boards";
import type { Board } from "@/types/kanban";
import { Logo } from "./Logo";
import { MobileBoardSwitcher } from "./MobileBoardSwitcher";

type HeaderProps = {
  board: Board;
  boards: Board[];
  selectedBoardId: string;
  onSelectBoard: (boardId: string) => void;
  onBoardCreated: (boardId: string) => void;
};

export function Header({
  board,
  boards,
  selectedBoardId,
  onSelectBoard,
  onBoardCreated,
}: HeaderProps) {
  const router = useRouter();
  const [editBoardOpen, setEditBoardOpen] = useState(false);
  const [deleteBoardOpen, setDeleteBoardOpen] = useState(false);

  async function handleDeleteBoard() {
    const result = await deleteBoardAction({ boardId: board.id });
    if (result.success) {
      router.refresh();
    }
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="hidden lg:block">
          <h1 className="truncate text-2xl font-bold">{board.name}</h1>
        </div>
        <div className="lg:hidden">
          <MobileBoardSwitcher
            boards={boards}
            selectedBoardId={selectedBoardId}
            selectedBoardName={board.name}
            onSelectBoard={onSelectBoard}
            onBoardCreated={onBoardCreated}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <AddTaskModal board={board} />
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Board options"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditBoardOpen(true)}>
              Edit Board
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteBoardOpen(true)}
            >
              Delete Board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EditBoardModal
        board={board}
        open={editBoardOpen}
        onOpenChange={setEditBoardOpen}
      />
      <DeleteConfirmationDialog
        open={deleteBoardOpen}
        onOpenChange={setDeleteBoardOpen}
        title="Delete this board?"
        description={`Are you sure you want to delete the '${board.name}' board? This action will remove all columns and tasks and cannot be reversed.`}
        onConfirm={handleDeleteBoard}
      />
    </header>
  );
}
