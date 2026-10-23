"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { ShowSidebarButton } from "@/components/layout/ShowSidebarButton";
import { Header } from "@/components/layout/Header";
import { BoardView } from "@/components/board/BoardView";
import { CreateBoardModal } from "@/components/modals/CreateBoardModal";
import { slugify, findBoardBySlug } from "@/lib/slug";
import type { Board } from "@/types/kanban";

export function DashboardShell({
  boards,
  activeSlug,
}: {
  boards: Board[];
  activeSlug: string | null;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const selectedBoard =
    (activeSlug ? findBoardBySlug(boards, activeSlug) : undefined) ?? boards[0];

  function goToBoard(boardId: string) {
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      router.push(`/dashboard/${slugify(board.name)}`);
    }
  }

  function goToCreatedBoard(board: { id: string; name: string }) {
    router.push(`/dashboard/${slugify(board.name)}`);
  }

  if (!selectedBoard) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
        <p className="max-w-xs text-sm font-bold text-muted-foreground">
          You don&apos;t have any boards yet. Create one to get started.
        </p>
        <CreateBoardModal onCreated={goToCreatedBoard} />
      </div>
    );
  }
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {sidebarOpen && (
        <Sidebar
          boards={boards}
          selectedBoardId={selectedBoard.id}
          onSelectBoard={goToBoard}
          onBoardCreated={goToCreatedBoard}
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
          onSelectBoard={goToBoard}
          onBoardCreated={goToCreatedBoard}
        />
        <main className="flex flex-1 overflow-hidden">
          <BoardView board={selectedBoard} />
        </main>
      </div>
    </div>
  );
}
