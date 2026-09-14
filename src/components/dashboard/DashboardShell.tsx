"use client";

import { useState } from "react";
import { useKanbanStore, useHasHydrated } from "@/store/kanban-store";
import { Sidebar } from "@/components/layout/Sidebar";
import { ShowSidebarButton } from "@/components/layout/ShowSidebarButton";
import { Header } from "@/components/layout/Header";
import { BoardView } from "@/components/board/BoardView";
import { CreateBoardModal } from "@/components/modals/CreateBoardModal";

export function DashboardShell() {
  const hydrated = useHasHydrated();
  const boards = useKanbanStore((state) => state.boards);
  const selectedBoardId = useKanbanStore((state) => state.selectedBoardId);
  const selectBoard = useKanbanStore((state) => state.selectBoard);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const selectedBoard =
    boards.find((board) => board.id === selectedBoardId) ?? boards[0];

  if (!hydrated) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <p className="text-sm font-bold text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!selectedBoard) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
        <p className="max-w-xs text-sm font-bold text-muted-foreground">
          You don&apos;t have any boards yet. Create one to get started.
        </p>
        <CreateBoardModal />
      </div>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {sidebarOpen && (
        <Sidebar
          boards={boards}
          selectedBoardId={selectedBoard.id}
          onSelectBoard={selectBoard}
          onHide={() => setSidebarOpen(false)}
          className="hidden lg:flex"
        />
      )}
      {!sidebarOpen && (
        <ShowSidebarButton
          onClick={() => setSidebarOpen(true)}
          className="hidden lg:flex"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          board={selectedBoard}
          boards={boards}
          selectedBoardId={selectedBoard.id}
          onSelectBoard={selectBoard}
        />
        <main className="flex flex-1 overflow-hidden">
          <BoardView board={selectedBoard} />
        </main>
      </div>
    </div>
  );
}
