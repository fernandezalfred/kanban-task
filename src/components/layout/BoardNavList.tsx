"use client";

import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateBoardModal } from "@/components/modals/CreateBoardModal";
import type { Board } from "@/types/kanban";

type BoardNavListProps = {
  boards: Board[];
  selectedBoardId: string;
  onSelectBoard: (boardId: string) => void;
};

export function BoardNavList({
  boards,
  selectedBoardId,
  onSelectBoard,
}: BoardNavListProps) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Boards">
      <p className="px-6 py-2 text-xs font-bold tracking-[0.15em] text-muted-foreground">
        ALL BOARDS ({boards.length})
      </p>
      <ul className="flex flex-col gap-1">
        {boards.map((board) => {
          const isActive = board.id === selectedBoardId;
          return (
            <li key={board.id}>
              <button
                type="button"
                onClick={() => onSelectBoard(board.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-r-full py-3 pr-6 pl-6 text-sm font-bold transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-primary"
                )}
              >
                <LayoutDashboard className="size-4 shrink-0" />
                <span className="truncate">{board.name}</span>
              </button>
            </li>
          );
        })}
        <li>
          <CreateBoardModal />
        </li>
      </ul>
    </nav>
  );
}
