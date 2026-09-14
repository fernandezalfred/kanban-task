import { mockBoards } from "@/lib/mock-data";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardPage() {
  return <DashboardShell boards={mockBoards} />;
}
