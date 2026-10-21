import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getBoards } from "@/actions/boards";
import { slugify } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const boards = await getBoards();

  if (boards.length === 0) {
    return <DashboardShell boards={boards} activeSlug={null} />;
  }

  redirect(`/dashboard/${slugify(boards[0].name)}`);
}
