"use client";

import { useState } from "react";
import type { Board } from "@/types/kanban";
import { Sidebar } from "@/components/layout/Sidebar";
import { ShowSidebarButton } from "@/components/layout/ShowSidebarButton";
import { Header } from "@/components/layout/Header";
import { BoardView } from "@/components/board/BoardView";

export function DashboardShell({ boards }: { boards: Board[] }) {
  const [selectedBoardId, setSelectedBoardId] = useState(boards[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const selectedBoard =
    boards.find((board) => board.id === selectedBoardId) ?? boards[0];

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {sidebarOpen && (
        <Sidebar
          boards={boards}
          selectedBoardId={selectedBoard.id}
          onSelectBoard={setSelectedBoardId}
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
        />
        <main className="flex flex-1 overflow-hidden">
          <BoardView board={selectedBoard} />
        </main>
      </div>
    </div>
  );
}
