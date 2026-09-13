import { mockBoards } from "@/lib/mock-data";

export default function DashboardPage() {
  const board = mockBoards[0];

  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-muted-foreground">
        Dashboard foundation ready — {board.name} board loaded with{" "}
        {board.columns.length} columns. Layout comes in phase 2.
      </p>
    </div>
  );
}
