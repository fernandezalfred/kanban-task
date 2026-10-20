import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getBoards } from "@/actions/boards";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const boards = await getBoards();
  return <DashboardShell boards={boards} />;
}
