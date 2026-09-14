import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
      aria-hidden="true"
    >
      <rect width="6" height="25" rx="2" fill="currentColor" />
      <rect x="9" width="6" height="17" rx="2" fill="currentColor" opacity="0.75" />
      <rect x="18" width="6" height="21" rx="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-foreground", className)}>
      <LogoMark className="text-primary" />
      <span className="text-xl font-bold tracking-tight">Kanban</span>
    </div>
  );
}
