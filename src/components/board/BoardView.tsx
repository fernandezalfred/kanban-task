import type { Board } from "@/types/kanban";
import { BoardColumn } from "./BoardColumn";
import { EmptyBoard } from "./EmptyBoard";

export function BoardView({ board }: { board: Board }) {
  if (board.columns.length === 0) {
    return <EmptyBoard />;
  }

  return (
    <div className="flex flex-1 gap-6 overflow-x-auto px-4 py-6 sm:px-6">
      {board.columns.map((column, index) => (
        <BoardColumn key={column.id} column={column} index={index} />
      ))}
      <div className="flex w-[280px] shrink-0 items-stretch">
        <button
          type="button"
          className="flex w-full flex-1 items-center justify-center rounded-lg bg-muted/50 text-lg font-bold text-muted-foreground transition-colors hover:text-primary"
        >
          + New Column
        </button>
      </div>
    </div>
  );
}
