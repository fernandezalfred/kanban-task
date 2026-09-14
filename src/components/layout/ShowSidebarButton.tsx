"use client";

import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShowSidebarButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Show sidebar"
      className={cn(
        "fixed bottom-8 left-0 z-20 flex size-12 items-center justify-center rounded-r-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/80",
        className
      )}
    >
      <Eye className="size-5" />
    </button>
  );
}
