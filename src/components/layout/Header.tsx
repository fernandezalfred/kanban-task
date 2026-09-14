"use client";

import { MoreVertical, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Board } from "@/types/kanban";
import { Logo } from "./Logo";
import { MobileBoardSwitcher } from "./MobileBoardSwitcher";

type HeaderProps = {
  board: Board;
  boards: Board[];
  selectedBoardId: string;
  onSelectBoard: (boardId: string) => void;
};

export function Header({
  board,
  boards,
  selectedBoardId,
  onSelectBoard,
}: HeaderProps) {
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
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <Button size="lg" className="gap-1 rounded-full px-3 sm:px-6">
          <Plus className="size-4" />
          <span className="hidden sm:inline">Add New Task</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Board options"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Board</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              Delete Board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
