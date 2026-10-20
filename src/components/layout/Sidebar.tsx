"use client";

import { EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Board } from "@/types/kanban";
import { Logo } from "./Logo";
import { BoardNavList } from "./BoardNavList";
import { ThemeToggle } from "./ThemeToggle";

type SidebarProps = {
  boards: Board[];
  selectedBoardId: string;
  onSelectBoard: (boardId: string) => void;
  onBoardCreated: (boardId: string) => void;
  onHide: () => void;
  className?: string;
};

export function Sidebar({
  boards,
  selectedBoardId,
  onSelectBoard,
  onBoardCreated,
  onHide,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-[261px] shrink-0 flex-col border-r border-border bg-card",
        className,
      )}
    >
      <div className="px-6 pt-8 pb-4">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto pt-4">
        <BoardNavList
          boards={boards}
          selectedBoardId={selectedBoardId}
          onSelectBoard={onSelectBoard}
          onBoardCreated={onBoardCreated}
        />
      </div>
      <div className="flex flex-col gap-4 px-6 pb-8">
        <ThemeToggle />
        <button
          type="button"
          onClick={onHide}
          className="flex items-center gap-3 rounded-md py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
        >
          <EyeOff className="size-4" />
          Hide Sidebar
        </button>
      </div>
    </aside>
  );
}
