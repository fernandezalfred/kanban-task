import type { Board } from "@/types/kanban";

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findBoardBySlug(
  boards: Board[],
  slug: string
): Board | undefined {
  return boards.find((board) => slugify(board.name) === slug);
}
