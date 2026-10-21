import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getBoards } from "@/actions/boards";
import { findBoardBySlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function DashboardBoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const boards = await getBoards();

  if (boards.length === 0) {
    redirect("/dashboard");
  }

  const board = findBoardBySlug(boards, slug);
  if (!board) {
    redirect("/dashboard");
  }

  return <DashboardShell boards={boards} activeSlug={slug} />;
}
