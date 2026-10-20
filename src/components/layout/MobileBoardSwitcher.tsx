"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Board } from "@/types/kanban";
import { BoardNavList } from "./BoardNavList";
import { ThemeToggle } from "./ThemeToggle";

type MobileBoardSwitcherProps = {
  boards: Board[];
  selectedBoardId: string;
  selectedBoardName: string;
  onSelectBoard: (boardId: string) => void;
  onBoardCreated: (boardId: string) => void;
};

export function MobileBoardSwitcher({
  boards,
  selectedBoardId,
  selectedBoardName,
  onSelectBoard,
  onBoardCreated,
}: MobileBoardSwitcherProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex items-center gap-2 text-lg font-bold">
        <span className="truncate">{selectedBoardName}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`}
        />
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[80dvh] rounded-t-xl border-none p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Boards</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 py-6">
          <BoardNavList
            boards={boards}
            selectedBoardId={selectedBoardId}
            onSelectBoard={(boardId) => {
              onSelectBoard(boardId);
              setOpen(false);
            }}
            onBoardCreated={(boardId) => {
              onBoardCreated(boardId);
              setOpen(false);
            }}
          />
          <div className="px-6">
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
