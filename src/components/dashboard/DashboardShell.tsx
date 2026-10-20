"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ShowSidebarButton } from "@/components/layout/ShowSidebarButton";
import { Header } from "@/components/layout/Header";
import { BoardView } from "@/components/board/BoardView";
import { CreateBoardModal } from "@/components/modals/CreateBoardModal";
import type { Board } from "@/types/kanban";

export function DashboardShell({ boards }: { boards: Board[] }) {
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(
    () => boards[0]?.id ?? null
  );
  const [prevBoards, setPrevBoards] = useState(boards);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  let effectiveSelectedBoardId = selectedBoardId;
  if (boards !== prevBoards) {
    setPrevBoards(boards);
    if (!boards.some((board) => board.id === selectedBoardId)) {
      effectiveSelectedBoardId = boards[0]?.id ?? null;
      setSelectedBoardId(effectiveSelectedBoardId);
    }
  }

  const selectedBoard =
    boards.find((board) => board.id === effectiveSelectedBoardId) ?? boards[0];

  if (!selectedBoard) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
        <p className="max-w-xs text-sm font-bold text-muted-foreground">
          You don&apos;t have any boards yet. Create one to get started.
        </p>
        <CreateBoardModal onCreated={setSelectedBoardId} />
      </div>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {sidebarOpen && (
        <Sidebar
          boards={boards}
          selectedBoardId={selectedBoard.id}
          onSelectBoard={setSelectedBoardId}
          onBoardCreated={setSelectedBoardId}
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
          onSelectBoard={setSelectedBoardId}
          onBoardCreated={setSelectedBoardId}
        />
        <main className="flex flex-1 overflow-hidden">
          <BoardView board={selectedBoard} />
        </main>
      </div>
    </div>
  );
}
