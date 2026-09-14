import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyBoard() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="max-w-xs text-sm font-bold text-muted-foreground">
        This board is empty. Create a new column to get started.
      </p>
      <Button size="lg" className="gap-1 rounded-full px-6">
        <Plus className="size-4" />
        Add New Column
      </Button>
    </div>
  );
}
